export const isChromeBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();

  const isChromium = ua.includes("chrome");
  const isBrave = ua.includes("brave") || (navigator as any).brave;
  const isFirefox = ua.includes("firefox");
  const isEdge = ua.includes("edg")

  return isChromium && !isBrave && !isFirefox && !isEdge;
};