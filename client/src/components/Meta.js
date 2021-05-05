import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords, index }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {index && <meta name="keywords" content={keywords} />}
      {!index && <meta name="robots" content="noindex"></meta>}
    </Helmet>
  );
};

Meta.defaultProprs = {
  title: 'DocuMenty',
  description:
    'DocuMenty - Create, Edit, Share & Work on documents simultaneously with your peers.',
  keywords:
    'documents, google docs clone, google docs alternative, document editor, real time document editor, collaborate, create share documents',
  index: false,
};

export default Meta;
