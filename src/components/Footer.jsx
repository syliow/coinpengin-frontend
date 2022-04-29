import React from "react";
import { Box, Button } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";

const _handleOpenGithub = () => {
  window.open("https://github.com/syliow/crypto-price-tracker", "_blank");
};

const Footer = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
      bgcolor="background.paper"
      color="text.primary"
      fontSize="sm"
      fontWeight="fontWeightBold"
    >
      Made with ❤️ by Liow Shan Yi
      <Button>
        <GitHubIcon onClick={_handleOpenGithub} />
      </Button>
    </Box>
  );
};

export default Footer;
