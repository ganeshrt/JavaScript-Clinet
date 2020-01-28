import React from 'react';
import { Math } from '../../components/Math';
import { Template } from '../../components/Template/Template';

const ChildrenDemo = () => (
  <>
    <Math first={3} second={0} operator="/"><Template /></Math>
    <Math first={3} second={5} operator="+"><Template /></Math>
    <Math first={4} second={9} operator="*"><Template /></Math>
  </>
);
export { ChildrenDemo };
