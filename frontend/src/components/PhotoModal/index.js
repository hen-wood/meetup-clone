import "./PhotoModal.css";

export default function PhotoModal({ img }) {
	const {
		props: { src, alt }
	} = img;
	return <img src={src} alt={alt} className="open-image" />;
}
