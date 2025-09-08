export const normalizeResult = (res: any) => {
  const ok = ('ok' in res) ? res.ok : (('success' in res) ? res.success : true);
  const data = ('value' in res) ? res.value : (('data' in res) ? res.data : res);
  return { ok, data, errorMessage: res?.errorMessage ?? res?.error?.message };
};