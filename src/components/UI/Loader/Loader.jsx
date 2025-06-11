import RingLoader from "react-spinners/RingLoader";

const Loader = ({size}) => {
  return (
    <div style={{padding:"20px", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <RingLoader color="#007dff" size={size} speedMultiplier={1} />
    </div>
  );
};

export default Loader;