import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const chakraConfig = defineConfig({
  theme: {
    recipes: {
      button: {
        variants: {
          visual: {
            solid: { bg: "red.200", color: "white" },
          },
        },
      },
    },
    tokens: {
      colors: {
        primary: { value: "#44634c" },

        // dark
        text_dark: { value: "#E0E0E0" },
        text_variant_dark: { value: "#B0B0B0" },
        surface_dark: { value: "#131315" },
        surface_container_dark: { value: "#191A1C" },
        surface_container_high_dark: { value: "#1D1E20" },
        surface_container_highest_dark: { value: "#232428" },

        // light
        text_light: { value: "#0E090B" },
        text_variant_light: { value: "#171717" },
        surface_light: { value: "#f5f5f5" },
        surface_container_light: { value: "#fafafa" },
        surface_container_high_light: { value: "#e5e5e5" },
        surface_container_highest_light: { value: "#d4d4d4" },
      },
    },
    semanticTokens: {
      colors: {
        text: {
          value: {
            _light: "{colors.text_light}",
            _dark: "{colors.text_dark}",
          },
        },
        text_variant: {
          value: {
            _light: "{colors.text_variant_light}",
            _dark: "{colors.text_variant_dark}",
          },
        },
        surface: {
          value: {
            _light: "{colors.surface_light}",
            _dark: "{colors.surface_dark}",
          },
        },
        surface_container: {
          value: {
            _light: "{colors.surface_container_light}",
            _dark: "{colors.surface_container_dark}",
          },
        },
        surface_container_high: {
          value: {
            _light: "{colors.surface_container_high_light}",
            _dark: "{colors.surface_container_high_dark}",
          },
        },
        surface_container_highest: {
          value: {
            _light: "{colors.surface_container_highest_light}",
            _dark: "{colors.surface_container_highest_dark}",
          },
        },
      },
    },
  },
});

const theme = createSystem(defaultConfig, chakraConfig);
export default theme;
