import React from 'react';
import { Skeleton } from 'antd';

export default function ComponentLoading() {
  return <Skeleton active title={false} paragraph={{ rows: 10 }} />;
}
