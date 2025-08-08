import { defineSemanticTokens } from "@chakra-ui/react";

export const colors = defineSemanticTokens.colors({
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
  on_primary: {
    value: {
      _light: "{colors.on_primary}",
      _dark: "{colors.on_primary}",
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
  outline: {
    value: {
      _light: "{colors.outline_dark}",
      _dark: "{colors.outline_dark}",
    },
  },
  outline_variant: {
    value: {
      _light: "{colors.outline_variant_dark}",
      _dark: "{colors.outline_variant_dark}",
    },
  },
  bg: {
    DEFAULT: {
      value: {
        _light: "{colors.white}",
        _dark: "{colors.black}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.gray.50}",
        _dark: "{colors.gray.950}",
      },
    },
    muted: {
      value: {
        _light: "{colors.gray.100}",
        _dark: "{colors.gray.900}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.gray.200}",
        _dark: "{colors.gray.800}",
      },
    },
    inverted: {
      value: {
        _light: "{colors.black}",
        _dark: "{colors.white}",
      },
    },
    panel: {
      value: {
        _light: "{colors.white}",
        _dark: "{colors.gray.950}",
      },
    },
    error: {
      value: {
        _light: "{colors.red.50}",
        _dark: "{colors.red.950}",
      },
    },
    warning: {
      value: {
        _light: "{colors.orange.50}",
        _dark: "{colors.orange.950}",
      },
    },
    success: {
      value: {
        _light: "{colors.green.50}",
        _dark: "{colors.green.950}",
      },
    },
    info: {
      value: {
        _light: "{colors.blue.50}",
        _dark: "{colors.blue.950}",
      },
    },
  },
  fg: {
    DEFAULT: {
      value: {
        _light: "{colors.black}",
        _dark: "{colors.gray.50}",
      },
    },
    muted: {
      value: {
        _light: "{colors.gray.600}",
        _dark: "{colors.gray.400}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.gray.400}",
        _dark: "{colors.gray.500}",
      },
    },
    inverted: {
      value: {
        _light: "{colors.gray.50}",
        _dark: "{colors.black}",
      },
    },
    error: {
      value: {
        _light: "{colors.red.500}",
        _dark: "{colors.red.400}",
      },
    },
    warning: {
      value: {
        _light: "{colors.orange.600}",
        _dark: "{colors.orange.300}",
      },
    },
    success: {
      value: {
        _light: "{colors.green.600}",
        _dark: "{colors.green.300}",
      },
    },
    info: {
      value: {
        _light: "{colors.blue.600}",
        _dark: "{colors.blue.300}",
      },
    },
  },
  border: {
    DEFAULT: {
      value: {
        _light: "{colors.gray.200}",
        _dark: "{colors.gray.800}",
      },
    },
    muted: {
      value: {
        _light: "{colors.gray.100}",
        _dark: "{colors.gray.900}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.gray.50}",
        _dark: "{colors.gray.950}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.gray.300}",
        _dark: "{colors.gray.700}",
      },
    },
    inverted: {
      value: {
        _light: "{colors.gray.800}",
        _dark: "{colors.gray.200}",
      },
    },
    error: {
      value: {
        _light: "{colors.red.500}",
        _dark: "{colors.red.400}",
      },
    },
    warning: {
      value: {
        _light: "{colors.orange.500}",
        _dark: "{colors.orange.400}",
      },
    },
    success: {
      value: {
        _light: "{colors.green.500}",
        _dark: "{colors.green.400}",
      },
    },
    info: {
      value: {
        _light: "{colors.blue.500}",
        _dark: "{colors.blue.400}",
      },
    },
  },
  gray: {
    contrast: {
      value: {
        _light: "{colors.white}",
        _dark: "{colors.black}",
      },
    },
    fg: {
      value: {
        _light: "{colors.gray.800}",
        _dark: "{colors.gray.200}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.gray.100}",
        _dark: "{colors.gray.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.gray.200}",
        _dark: "{colors.gray.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.gray.300}",
        _dark: "{colors.gray.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.gray.900}",
        _dark: "{colors.white}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.gray.400}",
        _dark: "{colors.gray.400}",
      },
    },
  },
  red: {
    contrast: {
      value: {
        _light: "white",
        _dark: "white",
      },
    },
    fg: {
      value: {
        _light: "{colors.red.700}",
        _dark: "{colors.red.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.red.100}",
        _dark: "{colors.red.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.red.200}",
        _dark: "{colors.red.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.red.300}",
        _dark: "{colors.red.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.red.600}",
        _dark: "{colors.red.600}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.red.500}",
        _dark: "{colors.red.500}",
      },
    },
  },
  orange: {
    contrast: {
      value: {
        _light: "white",
        _dark: "black",
      },
    },
    fg: {
      value: {
        _light: "{colors.orange.700}",
        _dark: "{colors.orange.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.orange.100}",
        _dark: "{colors.orange.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.orange.200}",
        _dark: "{colors.orange.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.orange.300}",
        _dark: "{colors.orange.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.orange.600}",
        _dark: "{colors.orange.500}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.orange.500}",
        _dark: "{colors.orange.500}",
      },
    },
  },
  green: {
    contrast: {
      value: {
        _light: "white",
        _dark: "white",
      },
    },
    fg: {
      value: {
        _light: "{colors.green.700}",
        _dark: "{colors.green.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.green.100}",
        _dark: "{colors.green.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.green.200}",
        _dark: "{colors.green.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.green.300}",
        _dark: "{colors.green.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.green.600}",
        _dark: "{colors.green.600}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.green.500}",
        _dark: "{colors.green.500}",
      },
    },
  },
  blue: {
    contrast: {
      value: {
        _light: "white",
        _dark: "white",
      },
    },
    fg: {
      value: {
        _light: "{colors.blue.700}",
        _dark: "{colors.blue.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.blue.100}",
        _dark: "{colors.blue.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.blue.200}",
        _dark: "{colors.blue.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.blue.300}",
        _dark: "{colors.blue.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.blue.600}",
        _dark: "{colors.blue.600}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.blue.500}",
        _dark: "{colors.blue.500}",
      },
    },
  },
  yellow: {
    contrast: {
      value: {
        _light: "black",
        _dark: "black",
      },
    },
    fg: {
      value: {
        _light: "{colors.yellow.800}",
        _dark: "{colors.yellow.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.yellow.100}",
        _dark: "{colors.yellow.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.yellow.200}",
        _dark: "{colors.yellow.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.yellow.300}",
        _dark: "{colors.yellow.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.yellow.300}",
        _dark: "{colors.yellow.300}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.yellow.500}",
        _dark: "{colors.yellow.500}",
      },
    },
  },
  teal: {
    contrast: {
      value: {
        _light: "white",
        _dark: "white",
      },
    },
    fg: {
      value: {
        _light: "{colors.teal.700}",
        _dark: "{colors.teal.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.teal.100}",
        _dark: "{colors.teal.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.teal.200}",
        _dark: "{colors.teal.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.teal.300}",
        _dark: "{colors.teal.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.teal.600}",
        _dark: "{colors.teal.600}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.teal.500}",
        _dark: "{colors.teal.500}",
      },
    },
  },
  purple: {
    contrast: {
      value: {
        _light: "white",
        _dark: "white",
      },
    },
    fg: {
      value: {
        _light: "{colors.purple.700}",
        _dark: "{colors.purple.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.purple.100}",
        _dark: "{colors.purple.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.purple.200}",
        _dark: "{colors.purple.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.purple.300}",
        _dark: "{colors.purple.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.purple.600}",
        _dark: "{colors.purple.600}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.purple.500}",
        _dark: "{colors.purple.500}",
      },
    },
  },
  pink: {
    contrast: {
      value: {
        _light: "white",
        _dark: "white",
      },
    },
    fg: {
      value: {
        _light: "{colors.pink.700}",
        _dark: "{colors.pink.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.pink.100}",
        _dark: "{colors.pink.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.pink.200}",
        _dark: "{colors.pink.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.pink.300}",
        _dark: "{colors.pink.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.pink.600}",
        _dark: "{colors.pink.600}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.pink.500}",
        _dark: "{colors.pink.500}",
      },
    },
  },
  cyan: {
    contrast: {
      value: {
        _light: "white",
        _dark: "white",
      },
    },
    fg: {
      value: {
        _light: "{colors.cyan.700}",
        _dark: "{colors.cyan.300}",
      },
    },
    subtle: {
      value: {
        _light: "{colors.cyan.100}",
        _dark: "{colors.cyan.900}",
      },
    },
    muted: {
      value: {
        _light: "{colors.cyan.200}",
        _dark: "{colors.cyan.800}",
      },
    },
    emphasized: {
      value: {
        _light: "{colors.cyan.300}",
        _dark: "{colors.cyan.700}",
      },
    },
    solid: {
      value: {
        _light: "{colors.cyan.600}",
        _dark: "{colors.cyan.600}",
      },
    },
    focusRing: {
      value: {
        _light: "{colors.cyan.500}",
        _dark: "{colors.cyan.500}",
      },
    },
  },
});
