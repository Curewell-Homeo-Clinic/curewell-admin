const FormOptions: React.FC<{
  isEdit: boolean;
  handleSave: () => Promise<void>;
  handleReset: () => void;
}> = ({ isEdit, handleReset, handleSave }) => {
  return (
    <div className="flex gap-x-2 justify-end">
      <button
        className="disabledBtn"
        disabled={isEdit ? false : true}
        onClick={handleReset}
      >
        Reset
      </button>
      <button
        className="btn disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300"
        disabled={isEdit ? false : true}
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default FormOptions;
