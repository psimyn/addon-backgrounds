import * as React from "react";

import Swatch from "./Swatch";
import assign = require("object-assign");

const style = {
  font: {
    fontFamily: "-apple-system,'.SFNSText-Regular', 'San Francisco', Roboto, 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif",
    fontSize: "14px",
  },
};

export interface BackgroundDetail {
  name?: string;
  value: string;
};

export interface BackgroundPanelProps {
  channel: NodeJS.EventEmitter;
}

const defaultBackground: BackgroundDetail = {
  name: "default",
  value: "transparent",
};

const __html = `
import { storiesOf } from "@kadira/storybook";
import backgrounds from "react-storybook-addon-backgrounds";

storiesOf("First Component", module)
  .addDecorator(backgrounds([
    { name: "twitter", value: "#00aced" },
    { name: "facebook", value: "#3b5998" },
  ]))
  .add("First Button", () => &lt;button&gt;Click me&lt;/button&gt;)
  ;
`.trim();

export default class BackgroundPanel extends React.Component<BackgroundPanelProps, any> {

  state = { backgrounds: [] };

  constructor(props) {
    super(props);
    this.props.channel.on("background-set", backgrounds => this.setState({ backgrounds }));
    this.props.channel.on("background-unset", backgrounds => this.setState({ backgrounds: [] }));
  }

  render () {

    const { channel } = this.props;
    const backgrounds: BackgroundDetail[] = [...this.state.backgrounds];

    if (!backgrounds.length) {
      return (
        <div style={assign({ padding: "20px" }, style.font)}>
          <h5 style={{ fontSize: "16px" }}>Setup Instructions</h5>
          <p>Please add the background decorator definition to your story.
          The background decorate accepts an array of items, which should include a
          name for your color (preferably the css class name) and the corresponding color / image value.</p>
          <p>Below is an example of how to add the background decorator to your story definition.</p>
          <pre style={{
            padding: "30px",
            display: "block",
            background: "rgba(19,19,19,0.9)",
            color: "rgba(255,255,255,0.95)",
            marginTop: "15px",
            lineHeight: "1.75em",
          }}><code dangerouslySetInnerHTML={{ __html }} /></pre>
        </div>
      );
    }

    // add reset as last option
    backgrounds.push(defaultBackground);
    return (
      <div style={{display: "inline-block", padding: "15px"}}>
        {backgrounds.map((background, key) => (
          <div key={key} style={{display: "inline-block", padding: "5px"}}>
            <Swatch value={background.value} name={background.name} channel={channel} />
          </div>
        ))}
      </div>
    );
  }
};