import {FormTranslation} from '@/types/FormTranslation';

export const RenderCSVTable = ({
  translationsData,
}: {
  translationsData: FormTranslation['translation'];
}) => {
  if (!translationsData) return;
  console.log(translationsData);
  const columns = Object.keys(translationsData);
  const keys = Object.keys(translationsData[columns[0]]);
  return (
    <table className='mt-10 w-fit text-left'>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} className='p-2 border border-gray-300'>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {keys.map((key) => (
          <tr key={key}>
            {columns.map((column) => (
              <td key={column} className='p-2 border border-gray-300'>
                {translationsData[column][key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
