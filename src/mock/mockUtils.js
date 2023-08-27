/* eslint-disable no-bitwise */
import { Response } from 'miragejs';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const extractLinkedData = (linkedData, idAttributeName, collection) => {
  if (linkedData.models.length > 0) {
    const dataObjs = linkedData.models.map(data => data.attrs);
    const relevantData = dataObjs.map(dataObj =>
      collection.find(dataObj[idAttributeName])
    );
    return relevantData.map(data => data.attrs);
  }
  return [];
};

const toPagedResult = (request, data) => {
  const params = request.queryParams;
  const pageNum = parseInt(params.pageNumber, 10);
  const pageSize = parseInt(params.pageSize, 10);
  const start = (pageNum - 1) * pageSize;
  const end = start + pageSize;

  const paged =
    !Number.isNaN(start) && !Number.isNaN(end) ? data.slice(start, end) : data;

  return new Response(
    200,
    {
      'X-Pagination': JSON.stringify({
        TotalCount: data.length,
        PageSize: pageSize,
        CurrentPage: pageNum,
        TotalPages: Math.ceil(data.length / pageSize),
        HasNext: Math.ceil(data.length / pageSize) > pageNum,
        HasPrev: pageNum > 0
      })
    },
    paged
  );
};

export { uuidv4, extractLinkedData, toPagedResult };
