import { toast, cssTransition, ToastContainer, Slide,Bounce } from "react-toastify";

const bounce = cssTransition({
  enter: "animate__animated animate__bounceIn",
  exit: "animate__animated animate__bounceOut",
});

export const notify = (message, type = "error") => {
  toast(message, {
    type: type,
    position: "top-center",
    autoClose: 2000, // 3 seconds
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    transition: Bounce, // Slide transition for better animation

    style: {
      marginTop: "50px", // Adjust this value to move the notification lower
    },
  });
};
