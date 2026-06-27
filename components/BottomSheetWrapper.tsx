// components/BottomSheetWrapper.tsx
import React, { forwardRef } from "react";
import BottomSheet, { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { styles } from "@/styles/home.styles";

const BottomSheetWrapper = forwardRef<BottomSheet, { snapPoints: (string | number)[], onChange?: (index: number) => void, children: React.ReactNode }>(
  ({ snapPoints, onChange, children }, ref) => {
    return (
      <BottomSheet
        ref={ref}
        snapPoints={snapPoints}
        onChange={onChange}
        enableDynamicSizing
        animateOnMount
        handleIndicatorStyle={{ backgroundColor: "#ccc" }}
        style={styles.bottomSheetStyle}
      >

          <BottomSheetScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
            {children}
          </BottomSheetScrollView>

      </BottomSheet>
    );
  }
);

export default BottomSheetWrapper;