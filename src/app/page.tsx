import React, {FC} from 'react';

import HomeTemplate from '@/components/templates/homeTemplate/homeTemplate';
import data from '@/service/data.json';

const Home: FC = () => {
  const items = data;

  return <HomeTemplate items={items} />;
};

export default Home;
