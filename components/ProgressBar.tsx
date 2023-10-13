export const ProgressBar = ({
  progressPercentage,
}: {
  progressPercentage: number;
}) => {
  return (
    <div className='flex items-center justify-center my-4'>
      <div
        style={{
          width: '100%',
          height: '10px',
          backgroundColor: '#ccc',
          textAlign: 'center',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            width: `${progressPercentage}%`,
            height: '100%',
            backgroundColor: '#36b27e',
            borderRadius: '6px',
          }}
        ></div>
      </div>
      <p className='ps-4'>{Math.floor(progressPercentage)}%</p>
    </div>
  );
};
