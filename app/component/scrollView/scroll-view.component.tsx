import { ScrollView,RefreshControl } from "react-native";
import ScrollViewStyle from "./scroll-view-style";
import { useState } from "react";
import React = require("react");

type typeOfFullHeightScrollParams = {
    children : any,
    isDark? : boolean,
    onRefreshFunction? : Function
}

const FullHeightScroll = ({children, isDark, onRefreshFunction}:typeOfFullHeightScrollParams)=>{

    const [refreshing,setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        onRefreshFunction ? onRefreshFunction() : false;
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }, []);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" style = {{...ScrollViewStyle.scrollView, backgroundColor : isDark ? ScrollViewStyle.darkStyle.backgroundColor : ScrollViewStyle.lightStyle.backgroundColor}} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
            {children}
        </ScrollView>
    );
}

export default FullHeightScroll;