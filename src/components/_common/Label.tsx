const Label = ({ title, required, className }: { title: string; required?: boolean; className?: string }) => {
  return (
    <div className='w-full' style={{ lineHeight: 2.3 }}>
      <label className={className}>
        {title} <span className='text-red-600'>{required ? '*' : ''}</span>
      </label>
    </div>
  );
};

export default Label;