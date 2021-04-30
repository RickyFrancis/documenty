import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <Form onSubmit={submitHandler} inline className="m-1">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Documents"
        className="mr-sm-2 m-1"
      ></Form.Control>
      <Button
        type="submit"
        variant="outline-primary"
        className="p-2 m-1 btn-sm"
      >
        &nbsp;<i className="fas fa-search"></i>&nbsp;
      </Button>
    </Form>
  );
};

export default SearchBox;
