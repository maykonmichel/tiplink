import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  ContentCopy as IconCopy,
  BookmarkBorder as IconBookmark,
  QrCodeRounded as IconQrCode,
} from "@mui/icons-material";
import QrModal from "../common/QrModal";

const LinkExportPanel = () => {
  const [url, setUrl] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const bookmark = () => {
    const title = document.title;
    if ((window as any).sidebar && (window as any).sidebar.addPanel) {
      // Mozilla Firefox Bookmark
      (window as any).sidebar.addPanel(title, url, "");
    } else if (window.external && "AddFavorite" in window.external) {
      // IE Favorite
      (window.external as any).AddFavorite(url, title);
    } else {
      // webkit - safari/chrome
      alert(
        "Press " +
          (navigator.userAgent.toLowerCase().indexOf("mac") != -1
            ? "Command/Cmd"
            : "CTRL") +
          " + D to bookmark this page."
      );
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
  };

  const handleCloseQrCode = () => {
    setQrOpen(false);
  };

  return (
    <Box>
      <Box
        width="100%"
        style={{
          padding: "1rem 2rem 1rem 2rem",
          backgroundColor: "#e8f5e9",
          borderRadius: "4rem",
          marginTop: "1rem",
        }}>
        <span
          style={{
            fontFamily: "Courier New",
            fontWeight: "bold",
            overflowWrap: "break-word",
          }}>
          {url}
        </span>
      </Box>
      <Box sx={{ display: "flex", gap: "1rem", width: "100%", marginTop: "1rem" }}>
        {renderButton(copied ? "Copied" : "Copy", <IconCopy />, copy)}
        {renderButton("Bookmark", <IconBookmark />, bookmark)}
        {renderButton("QR Code", <IconQrCode />, () => {
          setQrOpen(true);
        })}
      </Box>
      <QrModal
        message="Scan this QR code to open directly to this TipLink."
        open={qrOpen}
        value={url}
        handleClose={handleCloseQrCode}/>
    </Box>
  );
};

function renderButton(
  label: string,
  icon: React.ReactNode,
  onClick: () => void
): React.ReactNode {
  return (
    <Button
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        flexBasis: "0",
        padding: "0.75rem 0rem 0.75rem 0rem",
        textTransform: "none",
      }}
      variant="outlined"
      onClick={onClick}>
      {icon}
      <Typography variant="subtitle2" marginTop="0.25rem">
        {label}
      </Typography>
    </Button>
  );
}

export default LinkExportPanel;
