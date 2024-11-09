import React from "react";
export const Content = (props:{content: string}) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: props.content }} />
  );
};
