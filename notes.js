const apis = [
  {
    method: "post",
    route: "/add-tuition-status",
    params: {
      date: "29/08/2024",
      status: "open",
      reason: "NA",
    },
  },
  {
    method: "get",
    route: "/get-tuition-status",
    params: {
      date: "29/08/2024",
    },
    returnValue: {
      status: [
        {
          code: 404,
          means: "No status found",
          data: "No data",
        },
        {
          code: 200,
          means: "Status is found with given date",
          data: {
            tuitionStatus: 1, //open
          },
        },
        {
          code: 200,
          means: "Status is found with given date",
          data: {
            tuitionStatus: 0, //close
          },
        },
      ],
    },
  },
];
