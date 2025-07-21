interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  margin?: number;
}

const Divider = ({ direction = 'horizontal', margin = 16 }: DividerProps) => {
  const isHorizontal = direction === 'horizontal';
  return (
    <div
      className={`
        ${isHorizontal ? 'w-full h-px' : 'h-full w-px'}
        bg-gray-200`}
      style={{
        marginTop: isHorizontal ? margin : 0,
        marginBottom: isHorizontal ? margin : 0,
        marginLeft: isHorizontal ? 0 : margin,
        marginRight: isHorizontal ? 0 : margin,
      }}
    />
  );
};

export default Divider;
