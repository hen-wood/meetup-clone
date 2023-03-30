import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { thunkPostGroupImage } from "../../store/groupsReducer";
import { formatEventDate } from "./formatEventDate";

export default function GroupPhotos({ group, events, status, isPrivate }) {
	const dispatch = useDispatch();
	const [image, setImage] = useState(null);
	const [albums, setAlbums] = useState([
		{ title: "Meetdown Group Photo Album", photos: group.GroupImages },
		...events.map(event => {
			return {
				title: `${event.name} (${formatEventDate(event.startDate).slice(
					5,
					17
				)})`,
				photos: event.images
			};
		})
	]);
	useEffect(() => {
		setAlbums([
			{ title: "Meetdown Group Photo Album", photos: group.GroupImages },
			...events.map(event => {
				return {
					title: `${event.name} (${formatEventDate(event.startDate).slice(
						5,
						17
					)})`,
					photos: event.images
				};
			})
		]);
	}, [group.GroupImages]);

	const renderArrowPrev = (onClickHandler, hasPrev, label) =>
		hasPrev && (
			<button
				type="button"
				onClick={onClickHandler}
				title={label}
				className="car-button prev"
			>
				<i className="fa-solid fa-arrow-left photo-car__arrow"></i>
			</button>
		);

	const renderArrowNext = (onClickHandler, hasNext, label) =>
		hasNext && (
			<button
				type="button"
				onClick={onClickHandler}
				title={label}
				className="car-button next"
			>
				<i className="fa-solid fa-arrow-right photo-car__arrow"></i>
			</button>
		);

	const saveGroupPhoto = () => {
		const formData = new FormData();
		formData.append("image", image);
		dispatch(thunkPostGroupImage(formData, group.id)).then(() => {
			setImage(null);
		});
	};

	const updateFile = e => {
		const file = e.target.files[0];
		if (file) setImage(file);
	};

	return isPrivate && (status === "" || status === "pending") ? (
		<div className="about-members__list--private">
			<i className="fa-solid fa-lock private-icon"></i>
			<h2 className="ab-members-private__warning">
				This content is available only to members
			</h2>
		</div>
	) : (
		<div className="gr-photos__container">
			<div className="gr-photos__top">
				<h2 className="gr-photos__title">Albums ({albums.length})</h2>
				{status === "organizer" && !image && (
					<div className="gr-photos__form">
						<label htmlFor="image-upload-input" className="custom-file-input">
							<i className="fa fa-cloud-upload upload-file-icon"></i> Upload
							photo to group album
						</label>
						<input
							id="image-upload-input"
							name="image-upload-input"
							className="image-upload-input"
							type="file"
							onChange={updateFile}
						/>
					</div>
				)}
				{image && (
					<button className="gr-photos__save-button" onClick={saveGroupPhoto}>
						<i className="fa-solid fa-floppy-disk upload-file-icon"></i>
						Save group photo
					</button>
				)}
			</div>
			<div className="gr-photos__album-grid">
				{albums.map(albumObj => (
					<div key={albumObj.title} className="gr-photos__card">
						<Carousel
							showThumbs={false}
							renderArrowPrev={renderArrowPrev}
							renderArrowNext={renderArrowNext}
						>
							{albumObj.photos.map((photo, i) => (
								<img
									key={i}
									src={photo.url}
									alt={albumObj.title}
									className="gr-photos-car__image"
								/>
							))}
						</Carousel>
						<h3 className="gr-photos__album-title">{albumObj.title}</h3>
					</div>
				))}
			</div>
		</div>
	);
}
