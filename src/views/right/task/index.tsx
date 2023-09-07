import React, { useState, useEffect } from 'react';
import './index.scss';
import { RootState } from '@/store';
import { useDispatch,useSelector } from 'react-redux';
const Task: React.FC = (props) => {
const { } = props;
// const  = useSelector((state: RootState) => state.common.value);
const dispatch = useDispatch();
const [] = useState<number[]>([]);
return (
<div></div>
);
};
export default Task;