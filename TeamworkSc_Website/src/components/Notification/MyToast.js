import { toast } from "react-hot-toast";


const MyToast = (message, status) => {
  if (status === "success") {
    toast.success(message, {
      position: "top-center",
      autoClose: 1000,
    });
  } else if (status === "error") {
    toast.error(message, {
      position: "top-center",
      autoClose: 1000,
    });
  } else if (status === "warning") {
    toast.warning(message, {
      position: "top-center",
      autoClose: 1000,
    });
  } else if (status === "info") {
    toast.info(message, {
      position: "top-center",
      autoClose: 1000,
    });
  } else {
    console.error("Invalid toast type");
  }
};

export default MyToast;
   