import { Model, createServer, RestSerializer } from "miragejs";
import { IssueRoutes, IssuesSeeds } from "./issues";

const ApplicationSerializer = RestSerializer.extend({
  root: false,
  embed: true,
});

const makeServer = ({ environment = "development" } = {}) => {
  return createServer({
    environment,
    models: {
      issue: Model,
      issuedetail: Model,
    },
    serializers: {
      application: ApplicationSerializer,
    },
    seeds(server) {
      IssuesSeeds(server);
    },
    routes() {
      this.namespace = "api";
      IssueRoutes.call(this);
    },
  });
};

export default makeServer;
