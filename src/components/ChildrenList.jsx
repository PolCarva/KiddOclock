import { getHoursAndMinutes } from "../utils/utils";

const ChildrenList = ({ children, toggleModal }) => {
  const onChildClick = (child) => {
    toggleModal(child);
  };

  return (
    <div className="flex flex-col gap-2">
      {children.length === 0 && <p className="text-center text-slate-400">No hay niños registrados</p>}
      {children.map((child) => (
        <div
          key={child.id}
          onClick={() => onChildClick(child)}
          className="w-full flex justify-between bg-gray-100 hover:bg-gray-200 cursor-pointer rounded-sm p-2"
        >
          <h5 className="font-bold">{child.name}</h5>{" "}
          <div className="flex-1 mx-2 h-px border-black border-b border-dotted self-end"></div>
          <div className="">
            <span>{getHoursAndMinutes(child.screenTime).hours}hs </span>
            <span>{getHoursAndMinutes(child.screenTime).minutes}min</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChildrenList;
