import {FormTranslation} from '@/types/FormTranslation';

export const RenderCSVTable = ({
  translationsData,
}: {
  translationsData: FormTranslation['translation'];
}) => {
  if (!translationsData) return null;
  const columns = Object.keys(translationsData);
  const keys = Object.keys(translationsData[columns[0]]);

  return (
    <table className='mt-10 table-auto w-full text-left'>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} className='p-1 border border-gray-300'>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {keys.map((key) => (
          <tr key={key}>
            {columns.map((column) => (
              <td
                key={column}
                className='p-1 border border-gray-300 break-words'
              >
                <span className='writing-animation inline-block'>
                  {translationsData[column][key]}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
