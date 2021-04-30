import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children, permanent }) => {
  const [hidden, setHidden] = useState(false);

  if (!permanent) {
    setTimeout(() => {
      setHidden(true);
    }, 5000);
  }

  return (
    <Alert hidden={hidden} variant={variant}>
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
