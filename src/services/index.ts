export const authSuccessData = (data: any) => {
  return({
    status: data.status,
    successMsg: data?.data?.message ?? data.message,
    errorMsg: "",
  });
}

export const authReturnErrorData = (error: any) => {
  return({status: false, successMsg: "", errorMsg: error.message });
}

export const ReturnData = (data: any) => (data);

export const ReturnSuccess = (data: any) => ({
  status: data.status,
  message: data?.data?.message ?? data.message,
  errors: []
});

export const ReturnError = (error: any) => {
  return({status: false, message: error.message, errors: error.errors ?? []});
};
