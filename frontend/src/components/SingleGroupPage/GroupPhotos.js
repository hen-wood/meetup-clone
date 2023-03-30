import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { formatEventDate } from "./formatEventDate";

export default function GroupPhotos({ group, events, status, isPrivate }) {
	const albums = [
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
	];

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
