import { ImageResponse } from "next/og";

// Image metadata
export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				fontSize: 24,
				background: "#10253E",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "white",
				borderRadius: "8px",
				position: "relative",
			}}
		>
			K
		</div>,
		// ImageResponse options
		{
			// For convenience, we can re-use the exported icons size metadata
			// config to also set the ImageResponse's width and height.
			...size,
		},
	);
}
