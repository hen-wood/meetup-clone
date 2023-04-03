import { useModal } from "../../context/Modal";
import "./WarningModal.css";

export default function WarningModal({
	callBack,
	arg,
	message,
	confirmMessage
}) {
	const { closeModal } = useModal();
	return (
		<div className="warning-modal__container">
			<i
				className="fa-solid fa-xmark close-warning__button"
				onClick={closeModal}
			></i>
			<h2 className="warning-modal__message">{message}</h2>
			<button
				className="warning-modal__button"
				onClick={() => {
					callBack(arg);
					closeModal();
				}}
			>
				{confirmMessage}
			</button>
		</div>
	);
}
