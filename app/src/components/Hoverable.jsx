import useHover from "../hooks/useHover";

// Porte le comportement `style-hover="..."` du prototype .dc.html : un style de
// base et un style appliqué uniquement au survol (fusionné par-dessus).
export default function Hoverable({ as: Tag = "div", style, hoverStyle, children, ...rest }) {
  const [hovered, hoverHandlers] = useHover();
  const merged = hovered && hoverStyle ? { ...style, ...hoverStyle } : style;
  return (
    <Tag style={merged} {...hoverHandlers} {...rest}>
      {children}
    </Tag>
  );
}
