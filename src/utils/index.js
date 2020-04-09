import csvString from 'json2csv';

export function makeCSV(data) {
  const fields = Object.keys(data[0]);

  return csvString
    .parseAsync(data, { fields })
    .then((csv) => {
      csv = 'data:text/csv;charset=utf-8,' + csv;
      csv = encodeURI(csv);

      return {
        length: data.length,
        csv,
      };
    })
    .catch((err) => console.error(err));
}
