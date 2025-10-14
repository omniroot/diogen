import { useMediaQuery } from "@chakra-ui/react";

export const useMedia = () => {
	const [isMobile, isTablet, isDesktop] = useMediaQuery(["max-width: 480px", "max-width: 768px", "max-width: 1280px"]);

	return { isMobile, isTablet, isDesktop };
};
