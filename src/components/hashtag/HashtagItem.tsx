type HashtagItemProps = {
  onSelectCompany: (company: string) => void;
  isSelected: boolean;
  company: string;
};

export default function HashtagItem({
  onSelectCompany,
  isSelected,
  company,
}: HashtagItemProps) {
  const handleClick = () => {
    onSelectCompany(isSelected ? "" : company);
  };

  return (
    <li key={company}>
      <button onClick={handleClick}>#{company}</button>
    </li>
  );
}
