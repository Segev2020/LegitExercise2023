import _ from "lodash";
import moment from "moment";
import compareSeverity, { issueSeverityOptions } from "./severityUtils";
import { toPagedResult } from "./mockUtils";

export function IssueRoutes() {
  this.get("/issues", (schema, request) => {
    const params = request.queryParams;
    const originIds = params.originIds ? params.originIds.split(",") : [];
    const productIds = params.productIds ? params.productIds.split(",") : [];
    const issueTypes = params.issueType ? params.issueType.split(",") : [];
    const severities = params.severity ? params.severity.split(",") : [];
    const statuses = params.status ? params.status.split(",") : [];
    const filters = _.pick({ issueTypes, severities }, [
      "issueType",
      "severity",
    ]);
    const filtered =
      params.search !== undefined
        ? schema.issues
            .where(filters)
            .filter((issue) =>
              issue.title.toLowerCase().includes(params.search.toLowerCase())
            )
        : schema.issues.where(filters);


    const filteredStatus =
      params.status !== undefined
        ? filtered.filter((issue) => statuses.includes(issue.status))
        : filtered;

    let filteredSeverity =
      severities.length > 0
        ? filteredStatus.filter((issue) => severities.includes(issue.severity))
        : filteredStatus;

    let filteredIssueType =
      issueTypes.length > 0
        ? filteredSeverity.filter((issue) =>
            issueTypes.includes(issue.issueType)
          )
        : filteredSeverity;

    let filteredOrigin =
      originIds.length > 0
        ? filteredIssueType.filter((issue) =>
            originIds.includes(issue.originId)
          )
        : filteredIssueType;

    if (productIds > 0) {
      let productRepos = productIds.map(
        (id) => schema.repositoryproducts.where({ productId: id }).models
      );
      productRepos = productRepos.map((repoProducts) =>
        repoProducts.map((prod) => prod.repositoryId)
      );
      const flatten = productRepos.flat();
      filteredOrigin = filteredOrigin.filter((issue) =>
        flatten.includes(issue.originId)
      );
    }

    const sorted = filteredOrigin.sort((a, b) =>
      compareSeverity(a, b, (elem) => elem.severity)
    );

    return toPagedResult(request, sorted);
  });

  this.get("/issues/:id/detailed", (schema, request) => {
    const { id } = request.params;
    return schema.issuedetails.find(id);
  });

  this.patch("/issues/:id/status", (schema, request) => {
    const { id } = request.params;
    const { status } = JSON.parse(request.requestBody);
    const issueToUpdate = schema.issuedetails.find(id);
    issueToUpdate.update({
      status,
      statusChangedAt: moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
    });
  });

  this.get("/issues/statistics/count-over-time", (schema, request) => {
    const { interval, startDate, endDate } = request.queryParams;
    const currentDate = new Date(startDate);
    const endDateTime = endDate === undefined ? Date.now() : new Date(endDate);
    const responseData = [];
    while (currentDate <= endDateTime) {
      const singleDayData = { issueCounts: {} };
      issueSeverityOptions.forEach((severity) => {
        singleDayData.issueCounts[severity.toLowerCase()] = schema.issues.where(
          (issue) =>
            issue.severity === severity &&
            new Date(issue.detectedAt) <= currentDate &&
            (issue.status === "Open" ||
              new Date(issue.statusChangedAt) > currentDate)
        ).length;
      });

      singleDayData.date = currentDate.toISOString();
      currentDate.setTime(currentDate.getTime() + parseInt(interval, 10));
      responseData.push(singleDayData);
    }

    return responseData;
  });

  this.get("/issues/statistics/count-by-type-severity", (schema) => {
    const sortedIssues = schema.issues
      .where((issue) => issue.status === "Open")
      .models.sort((a, b) => compareSeverity(a, b, (issue) => issue.severity));

    const groupedIssues = _.groupBy(sortedIssues, (issue) => issue.issueType);
    const out = {};

    Object.keys(groupedIssues).forEach((type) => {
      const groupedBySeverity = _.groupBy(
        groupedIssues[type],
        (issue) => issue.severity
      );
      out[type] = Object.keys(groupedBySeverity).map((severity) => {
        return {
          count: groupedBySeverity[severity].length,
          severity,
        };
      });
    });

    return out;
  });

  this.get("/issues/statistics/top-by-title", (schema, request) => {
    const { limit } = request.queryParams;
    const openIssues = schema.issues.where(
      (issue) => issue.status === "Open"
    ).models;

    const groupedByTitle = _.groupBy(openIssues, (issue) => issue.title);

    let data = Object.keys(groupedByTitle)
      .map((title) => {
        return {
          issueType: groupedByTitle[title][0].issueType,
          title,
          count: groupedByTitle[title].length,
        };
      })
      .sort((a, b) => b.count - a.count);

    if (limit !== undefined) data = data.slice(0, parseInt(limit, 10));
    return data;
  });
}

function generateIssues() {
  return [
    {
      id: "0_CodeHygiene_compass",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "compass",
      severity: "Critical",
      detectedAt: "2021-01-17T08:00:01.3412",
      title: "Public Valid Access Key detected",
      description:
        "A valid access key was detected in a publicly exposed repository",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        line: '"dpl --provider=heroku --app=gitlab-ci-python-test-staging --api-key="**************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "SSH Key",
        email: "shu2323@stratos.io",
        file: ".gitlab-ci.yml",
        date: "2021-01-01T08:00:00.1527",
      },
      products: ["Android App", "Analytics"],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_CodeHygiene_aws-terraform-env_3457392",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "aws-terraform-env",
      severity: "High",
      detectedAt: "2020-12-30T14:31:05.032774",
      title: "Valid AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Resolved",
      statusChangedAt: "2021-01-09T18:21:32.848362",
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "romannurik@stratos.io",
        file: "terraform.tfstate",
        date: "2020-12-28T14:30:49.827Z",
      },
      products: ["DevOps"],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "1_CodeHygiene_aws-terraform-env_3457392",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "aws-terraform-env",
      severity: "Medium",
      detectedAt: "2020-12-28T14:30:50.1482",
      title: "SSH Private Key detected",
      description: "An SSH private key was detected in your repository.",
      status: "Open",
      statusChangedAt: null,
      owner: "jbogard@stratos.io",
      payload: {
        line: '"key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "SSH Private Key",
        email: "romannurik@stratos.io",
        file: "sshkeys.tf",
        date: "2020-12-28T14:30:49.8274",
      },
      products: ["DevOps"],
      compliances: [],
      instructions: [
        "Revoke any usage authorized by this key",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_CodeHygiene_stratos-common",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stratos-common",
      severity: "Low",
      detectedAt: "2021-01-14T14:30:50.1482",
      title: "Generic High Entropy secret detected",
      description:
        "A string with high entropy, that could be a secret, was detected in your repository.",
      status: "Open",
      statusChangedAt: null,
      owner: "vbuterin@stratos.io",
      payload: {
        line: 'api_key = "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "Generic High Entropy",
        email: "vbuterin@stratos.io",
        file: "automation.py",
        date: "2020-12-28T14:30:49.8274",
      },
      products: ["DevOps"],
      compliances: [],
      instructions: [
        "Revoke any usage authorized by this key",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "1_CodeHygiene_stratos-common",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stratos-common",
      severity: "Low",
      detectedAt: "2021-01-15T15:01:05.5723",
      title: "Generic High Entropy secret detected",
      description:
        "A string with high entropy, that could be a secret, was detected in your repository.",
      status: "Open",
      statusChangedAt: null,
      owner: "vbuterin@stratos.io",
      payload: {
        line: 'password = "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "Generic High Entropy",
        email: "vbuterin@stratos.io",
        file: "automation2.py",
        date: "2020-12-28T14:30:49.8274",
      },
      products: ["DevOps"],
      compliances: [],
      instructions: [
        "Revoke any usage authorized by this key",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_CodeHygiene_payment-svc",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "payment-svc",
      severity: "Medium",
      detectedAt: "2021-01-15T15:01:05.5723",
      title: "Possible PII detected",
      description:
        "A string that possibly contains personally identifiable information was detected in your repository.",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        line: 'console.log("Running on sample data. Profile=https://www.linkedin.com/in/**************/")',
        offender: "**************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "PII",
        email: "onevcat@stratos.io",
        file: "server_tests.js",
        date: "2020-12-28T14:30:49.8274",
      },
      products: ["Stratos Service", "Analytics"],
      compliances: [],
      instructions: [
        "Revoke any usage authorized by this key",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "CKV_AWS_16_aws_db_instance.db_Repository_aws-terraform-env",
      issueType: "CloudMisconfiguration",
      originType: "Repository",
      originId: "aws-terraform-env",
      severity: "Medium",
      detectedAt: "2020-12-28T17:22:51.032774",
      title: "Ensure all data stored in the RDS is securely encrypted at rest",
      description: "Keeping data unencrypted in an RDS is a potential risk",
      status: "Resolved",
      statusChangedAt: "2021-01-15T14:51:22.856346",
      owner: "ChenYilong@stratos.io",
      payload: {
        addedBy: "ChenYilong@stratos.io",
        platform: "Terraform",
        resource: "aws_db_instance - stratos_db",
        file: "db.tf",
        branch: "main",
        commit:
          "e9f1328e926598f669ee9be55d236310182951f34c99de6092b7ad25f1865f2b",
      },
      products: ["DevOps"],
      compliances: ["SOC 1", "SOC 2", "CIS 1.2.0"],
      instructions: [
        "In the specified file, locate the aws_db_instance resource",
        'Add to the resource - "storage_encrypted: true"',
      ],
      isAutomaticRemediationAvailable: true,
    },
    {
      id: "CKV_K8S_21_Ingress.myapp.default_Repository_stratos-helm-charts",
      issueType: "CloudMisconfiguration",
      originType: "Repository",
      originId: "stratos-helm-charts",
      severity: "Low",
      detectedAt: "2020-12-28T19:02:25.222961",
      title: "The default namespace should not be used",
      description:
        "Resources on the default namespaces are more likely to be overwritten and are more difficult to manage",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        addedBy: "derickbailey@stratos.io",
        platform: "Helm",
        resource: "stratos - ingress",
        file: "ingress.yaml",
        branch: "main",
        commit:
          "3bf50f64d7ea6d73d699e6a766e54ee19afa55169b1993b9b679c2e9202d2201",
      },
      products: ["Stratos Service"],
      compliances: [],
      instructions: [
        "In the specified resource, change the namespace parameter",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "CKV_K8S_21_Deployment.myapp.default_Repository_stratos-helm-charts",
      issueType: "CloudMisconfiguration",
      originType: "Repository",
      originId: "stratos-helm-charts",
      severity: "Low",
      detectedAt: "2020-12-28T19:02:25.222967",
      title: "The default namespace should not be used",
      description:
        "Resources on the default namespaces are more likely to be overwritten and are more difficult to manage",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        addedBy: "derickbailey@stratos.io",
        platform: "Helm",
        resource: "stratos - deployment",
        file: "deployment.yaml",
        branch: "main",
        commit:
          "25cfb3db2a02e9394e949009eb2b1d7ebe7bf88f56dd9c7cd730e4f04acfd082",
      },
      products: ["Stratos Service"],
      compliances: [],
      instructions: [
        "In the specified resource, change the namespace parameter",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "CKV_AWS_17_s3_bucket.Repository_aws-terraform-env",
      issueType: "CloudMisconfiguration",
      originType: "Repository",
      originId: "aws-terraform-env",
      severity: "High",
      detectedAt: "2020-12-28T17:22:51.032785",
      title:
        "Ensure all data stored in the S3 bucket is not publicly accessible",
      description:
        "A publicly accessible bucket may be exploited to gain sensitive information",
      status: "Open",
      statusChangedAt: null,
      owner: "ChenYilong@stratos.io",
      payload: {
        addedBy: "wyouflf@stratos.io",
        platform: "Terraform",
        resource: "aws_s3_bucket - user_photo_bucket",
        file: "user_photo_infra.tf",
        branch: "main",
        commit:
          "5db763f83f76623e779cad1df4be3764d8dc10afe53aea3864cfc9d1c4bb9f2d",
      },
      products: ["DevOps"],
      compliances: ["SOC 1", "SOC 2", "CIS 1.2.0"],
      instructions: [
        "Check if this was intentional, if not - follow these steps to protect your bucket",
        'Change the acl field from "public" to "private"',
        "Reprovision the Terraform environment.",
        "Check AWS audit logs for any possible misuse.",
      ],
      isAutomaticRemediationAvailable: true,
    },
    {
      id: "0_Repository_stratos-ios",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "stratos-ios",
      severity: "Low",
      detectedAt: "2020-12-29T10:25:29.351526",
      title: "Ensure branch protection is enabled",
      description: "Branch protection is not enabled for this repository",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        changedBy: null,
      },
      products: ["Stratos Service"],
      compliances: [],
      instructions: [
        "On GitHub, navigate to the main page of the repository",
        "Under your repository name, click Settings.",
        "In the left menu, click Branches.",
        'Next to "Branch protection rules", click Add rule.',
        'Under "Branch name pattern", type the branch name or pattern you want to protect.',
        "Optionally, you can configure specific branch rule settings.",
        "To confirm your branch protection rule, click Create or Save changes.",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_Repository_stratos-android",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "stratos-android",
      severity: "Medium",
      detectedAt: "2021-01-06T18:25:38.352426",
      title: "Security check bypassed",
      description:
        "Admin privileges have been used to bypass a failing security checks",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        changedBy: null,
      },
      products: ["Android App"],
      compliances: ["SOC 2"],
      instructions: ["Review the content introduced in this commit."],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "4_Repository_ads",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "ads",
      severity: "Medium",
      detectedAt: "2021-01-06T18:25:38.352426",
      title: "Repository should only allow signed commits",
      description:
        "According to your organizational policy, only sign commits should be accepted. The current configuration" +
        "allows all commits to be submitted. Not signing commits may lead to integrity issues and user spoofing ",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        changedBy: null,
      },
      products: ["Stratos Service"],
      compliances: ["SOC 2"],
      instructions: ["Review the content introduced in this commit."],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "4_Repository_user-role-manager",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "user-role-manager",
      severity: "Medium",
      detectedAt: "2021-01-06T18:25:38.352426",
      title: "Repository should only allow signed commits",
      description:
        "According to your organizational policy, only sign commits should be accepted. The current configuration" +
        "allows all commits to be submitted. Not signing commits may lead to integrity issues and user spoofing ",
      status: "Open",
      statusChangedAt: null,
      owner: "holdenk@stratos.io",
      payload: {
        changedBy: null,
      },
      products: ["Analytics"],
      compliances: ["SOC 2"],
      instructions: ["Review the content introduced in this commit."],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "4_Repository_entities",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "entities",
      severity: "Medium",
      detectedAt: "2021-01-09T18:25:38.352426",
      title: "Repository should only allow signed commits",
      description:
        "According to your organizational policy, only sign commits should be accepted. The current configuration" +
        "allows all commits to be submitted. Not signing commits may lead to integrity issues and user spoofing ",
      status: "Resolved",
      statusChangedAt: "2021-01-13T18:25:00.352426",
      owner: null,
      payload: {
        changedBy: null,
      },
      products: ["iOS App"],
      compliances: ["SOC 2"],
      instructions: ["Review the content introduced in this commit."],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "4_Repository_ads",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "ads",
      severity: "Medium",
      detectedAt: "2021-01-06T18:25:38.352426",
      title: "Repository should only allow signed commits",
      description:
        "According to your organizational policy, only sign commits should be accepted. The current configuration" +
        "allows all commits to be submitted. Not signing commits may lead to integrity issues and user spoofing ",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        changedBy: null,
      },
      products: ["Stratos Service"],
      compliances: ["SOC 2"],
      instructions: ["Review the content introduced in this commit."],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "4_Repository_user-role-manager",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "user-role-manager",
      severity: "Medium",
      detectedAt: "2021-01-06T18:25:38.352426",
      title: "Repository should only allow signed commits",
      description:
        "According to your organizational policy, only sign commits should be accepted. The current configuration" +
        "allows all commits to be submitted. Not signing commits may lead to integrity issues and user spoofing ",
      status: "Open",
      statusChangedAt: null,
      owner: "holdenk@stratos.io",
      payload: {
        changedBy: null,
      },
      products: ["Analytics"],
      compliances: ["SOC 2"],
      instructions: ["Review the content introduced in this commit."],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "4_Repository_entities",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "entities",
      severity: "Medium",
      detectedAt: "2021-01-09T18:25:38.352426",
      title: "Repository should only allow signed commits",
      description:
        "According to your organizational policy, only sign commits should be accepted. The current configuration" +
        "allows all commits to be submitted. Not signing commits may lead to integrity issues and user spoofing ",
      status: "Resolved",
      statusChangedAt: "2021-01-14T18:25:00.352426",
      owner: null,
      payload: {
        changedBy: null,
      },
      products: ["iOS App"],
      compliances: ["SOC 2"],
      instructions: ["Review the content introduced in this commit."],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "6_Repository_marketing-website",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "marketing-website",
      severity: "Low",
      detectedAt: "2021-01-17T18:25:38.352426",
      title:
        "External collaborator was given write permissions to a sensitive repository",
      description:
        "The user james@codevalue.com was given right permissions to your repository. \n" +
        "According to your organizational policy, external collaborators should not be given write access to repositories " +
        "tagged as sensitive. External collaborators are users from outside company domain",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["SOC 2"],
      instructions: [
        "Review the permissions given to the user. If needed to revoke then:",
        "Log in and select account settings",
        "Under members, find the user, and select remove, or change the permissions to read only",
      ],
      isAutomaticRemediationAvailable: false,
    },

    {
      id: "0_RepositoryGroup_StratosOps",
      issueType: "SDLCMisconfiguration",
      originType: "RepositoryGroup",
      originId: "StratosOps",
      severity: "High",
      detectedAt: "2020-12-28T10:22:29.351526",
      title: "Disallow creation of public repositories",
      description:
        "Creation of a public repository may cause an unintended data leak",
      status: "Resolved",
      statusChangedAt: "2021-01-14T15:31:05.154826",
      ignoredAt: null,
      owner: "holdenk@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["SOC 2"],
      instructions: [
        "In the top right corner of GitHub, click your profile photo, then click Your profile.",
        'On the left side of your profile page, under "Organizations", click the icon for your organization.',
        "Under your organization name, click  Settings.",
        "In the left sidebar, click Member privileges.",
        'Under "Repository creation", unselect the "Private" option',
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "2_Server_StratosMobile",
      issueType: "SDLCMisconfiguration",
      originType: "Server",
      originId: "StratosMobile",
      severity: "Critical",
      detectedAt: "2020-12-28T10:22:29.351526",
      title: "Server allows unauthenticated registration",
      description:
        "Any unauthenticated user can register to the system, and view any data that is not protected.",
      status: "Open",
      statusChangedAt: null,
      owner: "max@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["SOC 2"],
      instructions: [
        "Login as admin. Go to the admin area in Gitlab top menu",
        'Under "authentication", disable the option for free registration',
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "1_Server_StratosOps",
      issueType: "SDLCMisconfiguration",
      originType: "Server",
      originId: "StratosOps",
      severity: "Medium",
      detectedAt: "2021-01-05T10:25:28.801088",
      title: "Ensure Two Factor Authentication is mandatory for all users",
      description:
        "Users should authenticate via multi factor authentication which provides another layer of security to prevent unwanted logins and account theft",
      status: "Resolved",
      statusChangedAt: "2021-01-14T08:31:32.947512",
      owner: "jaredhanson@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["ISO/IEC 27001", "SOC 1", "SOC 2"],
      instructions: [
        "Under your organization name, click Settings.",
        "In the left sidebar, click Organization security.",
        'Under "Authentication", select Require two-factor authentication for everyone in your organization, then click Save.',
        "If prompted, read the information about members and outside collaborators who will be removed from the organization. Type your organization's name to confirm the change, then click Remove members & require two-factor authentication.",
        "On the Two-factor authentication page, click Set up using an app.",
        "If any members or outside collaborators are removed from the organization, we recommend sending them an invitation that can reinstate their former privileges and access to your organization. They must enable two-factor authentication before they can accept your invitation.",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "2_Server_StratosOps",
      issueType: "SDLCMisconfiguration",
      originType: "Server",
      originId: "StratosOps",
      severity: "Medium",
      detectedAt: "2021-01-10T10:31:28.801088",
      title: "New admin access token created",
      description:
        "Admin scoped personal access tokens are overprivileged, and as such should not be used",
      status: "Open",
      statusChangedAt: null,
      owner: "holdenk@stratos.io",
      payload: {
        changedBy: "jaredhanson@stratos.io",
      },
      products: [],
      compliances: ["ISO/IEC 27001", "SOC 2"],
      instructions: [
        "Verify the access token was created on purpose.",
        "If you would like to revoke the access token, instruct the admin who has created the token to follow these instructions.",
        "In the upper-right corner of any page, click your profile photo, then click Settings.",
        "In the left sidebar, click Developer settings.",
        "In the left sidebar, click Personal access tokens.",
        'Next to the "new_admin_token" token, click the Delete button.',
        "Confirm the deletion.",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "22_Repository_stratos-frontend6",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "stratos-frontend",
      severity: "Medium",
      detectedAt: "2021-01-10T10:31:28.801088",
      title: "New admin access token created",
      description:
        "Admin scoped personal access tokens are overprivileged, and as such should not be used",
      status: "Open",
      statusChangedAt: null,
      owner: "holdenk@stratos.io",
      payload: {
        changedBy: "jaredhanson@stratos.io",
      },
      products: ["Analytics"],
      compliances: ["ISO/IEC 27001", "SOC 2"],
      instructions: [
        "Verify the access token was created on purpose.",
        "If you would like to revoke the access token, instruct the admin who has created the token to follow these instructions.",
        "In the upper-right corner of any page, click your profile photo, then click Settings.",
        "In the left sidebar, click Developer settings.",
        "In the left sidebar, click Personal access tokens.",
        'Next to the "new_admin_token" token, click the Delete button.',
        "Confirm the deletion.",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "22_Repository_keycloak",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "keycloak",
      severity: "Medium",
      detectedAt: "2021-01-10T10:31:28.801088",
      title: "New admin access token created",
      description:
        "Admin scoped personal access tokens are overprivileged, and as such should not be used",
      status: "Resolved",
      statusChangedAt: "2021-01-14T10:31:28.801088",
      owner: "dannyG@stratos.io",
      payload: {
        changedBy: "jaredhanson@stratos.io",
      },
      products: ["Analytics"],
      compliances: ["ISO/IEC 27001", "SOC 2"],
      instructions: [
        "Verify the access token was created on purpose.",
        "If you would like to revoke the access token, instruct the admin who has created the token to follow these instructions.",
        "In the upper-right corner of any page, click your profile photo, then click Settings.",
        "In the left sidebar, click Developer settings.",
        "In the left sidebar, click Personal access tokens.",
        'Next to the "new_admin_token" token, click the Delete button.',
        "Confirm the deletion.",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "22_Repository_stratos-frontend6",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "stratos-frontend",
      severity: "Medium",
      detectedAt: "2021-01-10T10:31:28.801088",
      title: "New admin access token created",
      description:
        "Admin scoped personal access tokens are overprivileged, and as such should not be used",
      status: "Open",
      statusChangedAt: null,
      owner: "holdenk@stratos.io",
      payload: {
        changedBy: "jaredhanson@stratos.io",
      },
      products: ["Analytics"],
      compliances: ["ISO/IEC 27001", "SOC 2"],
      instructions: [
        "Verify the access token was created on purpose.",
        "If you would like to revoke the access token, instruct the admin who has created the token to follow these instructions.",
        "In the upper-right corner of any page, click your profile photo, then click Settings.",
        "In the left sidebar, click Developer settings.",
        "In the left sidebar, click Personal access tokens.",
        'Next to the "new_admin_token" token, click the Delete button.',
        "Confirm the deletion.",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "22_Repository_keycloak",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "keycloak",
      severity: "Medium",
      detectedAt: "2021-01-10T10:31:28.801088",
      title: "New admin access token created",
      description:
        "Admin scoped personal access tokens are overprivileged, and as such should not be used",
      status: "Resolved",
      statusChangedAt: "2021-01-17T10:31:28.801088",
      owner: "dannyG@stratos.io",
      payload: {
        changedBy: "jaredhanson@stratos.io",
      },
      products: ["Analytics"],
      compliances: ["ISO/IEC 27001", "SOC 2"],
      instructions: [
        "Verify the access token was created on purpose.",
        "If you would like to revoke the access token, instruct the admin who has created the token to follow these instructions.",
        "In the upper-right corner of any page, click your profile photo, then click Settings.",
        "In the left sidebar, click Developer settings.",
        "In the left sidebar, click Personal access tokens.",
        'Next to the "new_admin_token" token, click the Delete button.',
        "Confirm the deletion.",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_Collaborator_chriseidhof",
      issueType: "SDLCMisconfiguration",
      originType: "Collaborator",
      originId: "chriseidhof",
      severity: "Medium",
      detectedAt: "2020-12-29T10:25:28.801088",
      title: "Two Factor Authentication disabled for Collaborator",
      description:
        "Users should authenticate via multi factor authentication which provides another layer of security to prevent unwanted logins and account theft",
      status: "Resolved",
      statusChangedAt: "2021-01-14T08:31:32.947512",
      owner: "jaredhanson@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["ISO/IEC 27001", "SOC 1", "SOC 2"],
      // prettier-ignore
      instructions: [
        'Download a TOTP app.',
        'In the upper-right corner of any page, click your profile photo, then click Settings.',
        'In the left sidebar, click Account security.',
        'Under "Two-factor authentication", click Enable two-factor authentication.',
        'On the Two-factor authentication page, click Set up using an app.',
        'Save your recovery codes in a safe place. Your recovery codes can help you get back into your account if you lose access.',
        'After saving your two-factor recovery codes, click Next.',
        'Scan the QR code with your mobile device\'s app. After scanning, the app displays a six-digit code that you can enter on GitHub.',
        'The TOTP mobile application saves your GitHub account and generates a new authentication code every few seconds. On GitHub, on the 2FA page, type the code and click Enable.',
        'After you\'ve saved your recovery codes and enabled 2FA, we recommend you sign out and back in to your account.',
        'In case of problems, such as a forgotten password or typo in your email address, you can use recovery codes to access your account and correct the problem.'
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_Collaborator_chriseidhof",
      issueType: "SDLCMisconfiguration",
      originType: "Collaborator",
      originId: "chriseidhof",
      severity: "Low",
      detectedAt: "2020-12-29T10:25:28.801088",
      title: "Collaborator has unused admin privileges",
      description:
        "Admin privileges unused for the last 120 days can be revoked. " +
        "It is recommended to use write privileges and refrain from using admin when possible. " +
        "Admin permissions give total control and are dangerous when compromised",
      status: "Open",
      statusChangedAt: "2021-01-14T08:31:32.947512",
      ignoredAt: null,
      owner: "davids@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["ISO/IEC 27001", "SOC 1", "SOC 2"],
      instructions: [
        "Login and go to account setting",
        "Select members, and choose the current member",
        "Under permissions, remove the admin rights. You may choose write permissions",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_Collaborator_chriseidhof",
      issueType: "SDLCMisconfiguration",
      originType: "Collaborator",
      originId: "chriseidhof",
      severity: "Low",
      detectedAt: "2020-12-29T10:25:28.801088",
      title: "Collaborator has unused admin privileges",
      description:
        "Admin privileges unused for the last 120 days can be revoked. " +
        "It is recommended to use write privileges and refrain from using admin when possible. " +
        "Admin permissions give total control and are dangerous when compromised",
      status: "Open",
      statusChangedAt: "2021-01-13T08:31:32.947512",
      ignoredAt: null,
      owner: "davids@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["ISO/IEC 27001", "SOC 1", "SOC 2"],
      instructions: [
        "Login and go to account setting",
        "Select members, and choose the current member",
        "Under permissions, remove the admin rights. You may choose write permissions",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_Collaborator_jaredhanson",
      issueType: "SDLCMisconfiguration",
      originType: "Collaborator",
      originId: "jaredhanson",
      severity: "Medium",
      detectedAt: "2020-12-29T10:25:28.801088",
      title: "Two Factor Authentication disabled for Collaborator",
      description:
        "Users should authenticate via multi factor authentication which provides another layer of security to prevent unwanted logins and account theft",
      status: "Resolved",
      statusChangedAt: "2021-01-14T08:31:32.947512",
      owner: "jaredhanson@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["ISO/IEC 27001", "SOC 1", "SOC 2"],
      // prettier-ignore
      instructions: [
        'Download a TOTP app.',
        'In the upper-right corner of any page, click your profile photo, then click Settings.',
        'In the left sidebar, click Account security.',
        'Under "Two-factor authentication", click Enable two-factor authentication.',
        'On the Two-factor authentication page, click Set up using an app.',
        'Save your recovery codes in a safe place. Your recovery codes can help you get back into your account if you lose access.',
        'After saving your two-factor recovery codes, click Next.',
        'Scan the QR code with your mobile device\'s app. After scanning, the app displays a six-digit code that you can enter on GitHub.',
        'The TOTP mobile application saves your GitHub account and generates a new authentication code every few seconds. On GitHub, on the 2FA page, type the code and click Enable.',
        'After you\'ve saved your recovery codes and enabled 2FA, we recommend you sign out and back in to your account.',
        'In case of problems, such as a forgotten password or typo in your email address, you can use recovery codes to access your account and correct the problem.'
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "0_Collaborator_kennethreitz",
      issueType: "SDLCMisconfiguration",
      originType: "Collaborator",
      originId: "kennethreitz",
      severity: "Medium",
      detectedAt: "2020-12-29T10:25:28.801088",
      title: "Two Factor Authentication disabled for Collaborator",
      description:
        "Users should authenticate via multi factor authentication which provides another layer of security to prevent unwanted logins and account theft",
      status: "Resolved",
      statusChangedAt: "2021-01-14T08:31:32.947512",
      owner: "jaredhanson@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: ["ISO/IEC 27001", "SOC 1", "SOC 2"],
      // prettier-ignore
      instructions: [
        'Download a TOTP app.',
        'In the upper-right corner of any page, click your profile photo, then click Settings.',
        'In the left sidebar, click Account security.',
        'Under "Two-factor authentication", click Enable two-factor authentication.',
        'On the Two-factor authentication page, click Set up using an app.',
        'Save your recovery codes in a safe place. Your recovery codes can help you get back into your account if you lose access.',
        'After saving your two-factor recovery codes, click Next.',
        'Scan the QR code with your mobile device\'s app. After scanning, the app displays a six-digit code that you can enter on GitHub.',
        'The TOTP mobile application saves your GitHub account and generates a new authentication code every few seconds. On GitHub, on the 2FA page, type the code and click Enable.',
        'After you\'ve saved your recovery codes and enabled 2FA, we recommend you sign out and back in to your account.',
        'In case of problems, such as a forgotten password or typo in your email address, you can use recovery codes to access your account and correct the problem.'
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "1_CodeHygiene_stratos-frontend",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stratos-frontend",
      severity: "High",
      detectedAt: "2020-12-30T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: ["Analytics"],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "11_CodeHygiene_stripe-API",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stripe-API",
      severity: "High",
      detectedAt: "2021-01-10T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: [],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "25_CodeHygiene_packer-ami",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "packer-ami",
      severity: "High",
      detectedAt: "2021-01-12T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: [],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "1_CodeHygiene_stratos-android",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stratos-android",
      severity: "High",
      detectedAt: "2021-01-15T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: ["Android App"],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "2_CodeHygiene_stratos-android",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stratos-android",
      severity: "High",
      detectedAt: "2021-01-15T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Resolved",
      statusChangedAt: "2021-01-17T14:32:06.032774",
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: ["Android App"],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "11_CodeHygiene_stripe-API",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stripe-API",
      severity: "High",
      detectedAt: "2021-01-10T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: [],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "25_CodeHygiene_packer-ami",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "packer-ami",
      severity: "High",
      detectedAt: "2021-01-12T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: [],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "1_CodeHygiene_stratos-android",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stratos-android",
      severity: "High",
      detectedAt: "2021-01-15T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Resolved",
      statusChangedAt: "2021-01-17T14:32:05.032774",
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: ["Android App"],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "2_CodeHygiene_stratos-android",
      issueType: "CodeHygiene",
      originType: "Repository",
      originId: "stratos-android",
      severity: "High",
      detectedAt: "2021-01-15T14:31:05.032774",
      title: "AWS Access Key detected",
      description:
        "A key was detected in your repository, containing AWS access credentials",
      status: "Resolved",
      statusChangedAt: "2021-01-17T14:32:06.032774",
      owner: null,
      payload: {
        line: '"aws_access_key": "****************"',
        offender: "****************",
        branch: "main",
        commit:
          "b59a8111849acd151664c969f58a8814b4121bb377150b2be6e1123c0197c2a1",
        rule: "AWS Access Key",
        email: "maxdev@stratos.io",
        file: "terraform.tfstate",
        date: "2019-11-23T14:30:49.827Z",
      },
      products: ["Android App"],
      compliances: [],
      instructions: [
        "Revoke the secret using the AWS IAM console",
        "Inspect audit logs for potential misuse",
        "Clean from git history",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "CKV_AWS_17_IAM.Repository_stratos-frontend",
      issueType: "CloudMisconfiguration",
      originType: "Repository",
      originId: "stratos-frontend",
      severity: "High",
      detectedAt: "2021-01-03T17:22:51.032785",
      title: "Ensure no excessive Permissions for IAM User",
      description:
        'IAM permissions should never use "everything" and always reference the specific permissions needed ',
      status: "Open",
      statusChangedAt: null,
      owner: null,
      payload: {
        addedBy: "ronnyv@stratos.io",
        platform: "Terraform",
        resource: "IAM user",
        file: "terraform.tf",
        branch: "main",
        commit:
          "5db763f83f76623e779cad1df4be3764d8dc10afe53aea3864cfc9d1c4bb9f2d",
      },
      products: ["Analytics"],
      compliances: ["SOC 1", "SOC 2", "CIS 1.2.0"],
      instructions: [
        "Check if this was intentional, if not - follow these steps to protect your role",
        "Remove the user - go to the IAM console, and select the user provisioned in this file",
        "If you want to revoke permissions by removing an existing policy, view the Policy type to understand how the user is getting that policy before choosing X to remove the policy.",
        "Change the highlighted line to include the needed permissions",
      ],
      isAutomaticRemediationAvailable: true,
    },
    {
      id: "0_Collaborator_kennethreitz",
      issueType: "SDLCMisconfiguration",
      originType: "Collaborator",
      originId: "kennethreitz",
      severity: "Low",
      detectedAt: "2020-12-29T10:25:28.801088",
      title: "Two Factor Authentication disabled for Collaborator",
      description:
        "Users should authenticate via multi factor authentication which provides another layer of security to prevent unwanted logins and account theft",
      status: "Open",
      statusChangedAt: null,
      owner: "jaredhanson@stratos.io",
      payload: {
        changedBy: null,
      },
      products: ["Stratos Service"],
      compliances: ["ISO/IEC 27001", "SOC 1", "SOC 2"],
      instructions: [
        "Download a TOTP app.",
        "In the upper-right corner of any page, click your profile photo, then click Settings.",
        "In the left sidebar, click Account security.",
        'Under "Two-factor authentication", click Enable two-factor authentication.',
        "On the Two-factor authentication page, click Set up using an app.",
        "Save your recovery codes in a safe place. Your recovery codes can help you get back into your account if you lose access.",
        "After saving your two-factor recovery codes, click Next.",
        "Scan the QR code with your mobile device's app. After scanning, the app displays a six-digit code that you can enter on GitHub.",
        "The TOTP mobile application saves your GitHub account and generates a new authentication code every few seconds. On GitHub, on the 2FA page, type the code and click Enable.",
        "After you've saved your recovery codes and enabled 2FA, we recommend you sign out and back in to your account.",
        "In case of problems, such as a forgotten password or typo in your email address, you can use recovery codes to access your account and correct the problem.",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "1_SDLCMisconfiguration_ui-components",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "ui-components",
      severity: "Low",
      detectedAt: "2020-12-30T14:31:05.032774",
      title: "Repository should contain a .gitignore file",
      description:
        "Ignore file safeguards from accidental commit of confidential files",
      status: "Open",
      statusChangedAt: null,
      owner: "jaredhanson@stratos.io",
      payload: {
        changedBy: null,
      },
      products: [],
      compliances: [],
      instructions: [
        "Create a .gitignore file in the repository",
        "Use https://www.toptal.com/developers/gitignore to select known services",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "1_SDLCMisconfiguration_compass",
      issueType: "SDLCMisconfiguration",
      originType: "Repository",
      originId: "compass",
      severity: "Low",
      detectedAt: "2021-01-16T14:31:05.032774",
      title: "Repository should contain a .gitignore file",
      description:
        "Ignore file safeguards from accidental commit of confidential files",
      status: "Open",
      statusChangedAt: null,
      owner: "kennethreitz@stratos.io",
      payload: {
        changedBy: null,
      },
      products: ["Android App", "Analytics"],
      compliances: [],
      instructions: [
        "Create a .gitignore file in the repository",
        "Use https://www.toptal.com/developers/gitignore to select known services",
      ],
      isAutomaticRemediationAvailable: false,
    },
    {
      id: "CKV_AWS_17_s3_bucket.Repository_23_32679ced-2ac9-42b2-94e4-b58e457d53f7",
      issueType: "CloudMisconfiguration",
      originType: "Repository",
      originId: "aws-terraform-env",
      severity: "High",
      detectedAt: "2020-12-28T17:22:51.032785",
      title:
        "Ensure all data stored in the S3 bucket is not publicly accessible",
      description:
        "A publicly accessible bucket may be exploited to gain sensitive information",
      status: "Open",
      statusChangedAt: null,
      owner: "ChenYilong@stratos.io",
      payload: {
        addedBy: "wyouflf@stratos.io",
        platform: "Terraform",
        resource: "aws_s3_bucket - user_data_bucket",
        file: "user_data_infra.tf",
        branch: "main",
        commit:
          "12b763f83f76623e779cad1df4be3764d8dc10afe53aea3864cfc9d1c4bb112d",
      },
      products: ["DevOps"],
      compliances: ["SOC 1", "SOC 2", "CIS 1.2.0"],
      instructions: [
        "Check if this was intentional, if not - follow these steps to protect your bucket",
        'Change the acl field from "public" to "private"',
        "Reprovision the Terraform environment.",
        "Check AWS audit logs for any possible misuse.",
      ],
      isAutomaticRemediationAvailable: true,
    },
    {
      id: "CKV_AWS_18_s3_bucket.Repository_stratos-helm-charts",
      issueType: "CloudMisconfiguration",
      originType: "Repository",
      originId: "stratos-helm-charts",
      severity: "High",
      detectedAt: "2020-12-28T17:22:51.032785",
      title:
        "Ensure all data stored in the S3 bucket is not publicly accessible",
      description:
        "A publicly accessible bucket may be exploited to gain sensitive information",
      status: "Open",
      statusChangedAt: null,
      owner: "ChenYilong@stratos.io",
      payload: {
        addedBy: "wyouflf@stratos.io",
        platform: "Terraform",
        resource: "aws_s3_bucket - user_data_bucket",
        file: "user_data_infra.tf",
        branch: "main",
        commit:
          "12b763f83f76623e779cad1df4be3764d8dc10afe53aea3864cfc9d1c4bb112d",
      },
      products: ["Stratos Service"],
      compliances: ["SOC 1", "SOC 2", "CIS 1.2.0"],
      instructions: [
        "Check if this was intentional, if not - follow these steps to protect your bucket",
        'Change the acl field from "public" to "private"',
        "Reprovision the Terraform environment.",
        "Check AWS audit logs for any possible misuse.",
      ],
      isAutomaticRemediationAvailable: true,
    },
  ];
}

const ISSUE_KEYS = [
  "id",
  "issueType",
  "originType",
  "originId",
  "severity",
  "detectedAt",
  "title",
  "description",
  "statusChangedAt",
  "owner",
  "status",
];

export function IssuesSeeds(server) {
  const issues = generateIssues();
  issues.forEach((issue) => {
    server.create("issuedetail", issue);
    server.create("issue", _.pick(issue, ISSUE_KEYS));
  });
}
