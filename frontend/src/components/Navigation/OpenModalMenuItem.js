// frontend/src/components/Navigation/OpenModalMenuItem.js
import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalMenuItem({
	modalComponent, // component to render inside the modal
	itemText, // text of the menu item that opens the modal
	className, // Optional className string
	onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
	onModalClose // optional: callback function that will be called once the modal is closed
}) {
	const { setModalContent, setOnModalClose } = useModal();

	const onClick = () => {
		if (onModalClose) setOnModalClose(onModalClose);
		setModalContent(modalComponent);
		if (onItemClick) onItemClick();
	};

	return (
		<span className={`menu-item ${className}`} onClick={onClick}>
			{itemText}
		</span>
	);
}

export default OpenModalMenuItem;
