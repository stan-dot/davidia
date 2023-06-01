import {
  Box,
  ModifierKey,
  SelectionTool,
  useVisCanvasContext,
} from '@h5web/lib';
import { useMemo, useState } from 'react';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';

import {
  SelectionType,
  makeShapes,
  pointsToSelection,
  pointsToShape,
} from './selections';

interface SelectionComponentProps extends PlotSelectionProps {
  selectionType?: SelectionType;
  modifierKey: ModifierKey | ModifierKey[];
  disabled?: boolean;
}

export function SelectionComponent(props: SelectionComponentProps) {
  const disabled = props.disabled ?? false;
  const def = { colour: 'blue', alpha: 0.3 };
  const selectionType = props.selectionType ?? SelectionType.rectangle;

  const context = useVisCanvasContext();
  const { canvasBox, dataToHtml } = context;
  const size = canvasBox.size;

  const selections = useMemo(() => {
    return makeShapes(size, props.selections, props.addSelection);
  }, [size, props.selections, props.addSelection]);

  const camera = useThree((state) => state.camera);
  const isFlipped = useMemo(() => {
    const o = dataToHtml(camera, new Vector3(0, 0));
    const v = dataToHtml(camera, new Vector3(1, 1)).sub(o);
    return [v.x < 0, v.y < 0] as [boolean, boolean];
  }, [camera, dataToHtml]);

  const [counters, setCounters] = useState({
    line: 0,
    rectangle: 0,
    polyline: 0,
    polygon: 0,
    circle: 0,
    ellipse: 0,
    sector: 0,
    unknown: 0,
  });

  function updateCounters(t: SelectionType) {
    const newCounters = counters;
    newCounters[t]++;
    setCounters(newCounters);
  }

  return (
    <>
      {!disabled && (
        <SelectionTool
          modifierKey={props.modifierKey}
          validate={({ html }) => Box.fromPoints(...html).hasMinSize(20)}
          onValidSelection={({ data }) => {
            const s = pointsToSelection(
              selectionType,
              data,
              def.colour,
              def.alpha,
              counters[selectionType],
              updateCounters
            );
            return props.addSelection(s);
          }}
        >
          {({ html: htmlSelection }, _, isValid) =>
            pointsToShape(
              selectionType,
              htmlSelection,
              isFlipped,
              isValid ? def.colour : 'orangered',
              def.alpha,
              size
            )
          }
        </SelectionTool>
      )}
      {selections}
    </>
  );
}
