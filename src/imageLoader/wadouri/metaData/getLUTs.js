function getLUT(pixelRepresentation, lutDataSet) {
  let numLUTEntries = lutDataSet.uint16('x00283002', 0);

  if (numLUTEntries === 0) {
    numLUTEntries = 65535;
  }
  let firstValueMapped = 0;

  if (pixelRepresentation === 0) {
    firstValueMapped = lutDataSet.uint16('x00283002', 1);
  } else {
    firstValueMapped = lutDataSet.int16('x00283002', 1);
  }
  const numBitsPerEntry = lutDataSet.uint16('x00283002', 2);
  // console.log('LUT(', numLUTEntries, ',', firstValueMapped, ',', numBitsPerEntry, ')');
  const lut = {
    id: '1',
    firstValueMapped,
    numBitsPerEntry,
    lut: [],
  };

  // console.log("minValue=", minValue, "; maxValue=", maxValue);
  const lutData = lutDataSet.elements.x00283006;

  for (let i = 0; i < numLUTEntries; i++) {
    if (pixelRepresentation === 0) {
      // 根据标准 00283006(lutdata) 应该是US或者OW类型, 但是我们线上应用的时候,
      // 发现部分厂商传递lutdata的时候采用的是ss类型, 导致解析除了问题
      // 我们根据numLUTEntries和bytearray里面lut data的length做比较, 如果比较为1:1 则证明无需处理
      if (lutData.length / numLUTEntries === 1) {
        lut.lut[i] = lutDataSet.byteArray[lutData.dataOffset + i];
      } else {
        lut.lut[i] = lutDataSet.uint16('x00283006', i);
      }
    } else {
      // 根据标准 00283006(lutdata) 应该是US或者OW类型, 但是我们线上应用的时候,
      // 发现部分厂商传递lutdata的时候采用的是ss类型, 导致解析除了问题
      // 我们根据numLUTEntries和bytearray里面lut data的length做比较, 如果比较为1:1 则证明无需处理
      if (lutData.length / numLUTEntries === 1) {
        lut.lut[i] = lutDataSet.byteArray[lutData.dataOffset + i];
      } else {
        lut.lut[i] = lutDataSet.int16('x00283006', i);
      }
    }
  }

  return lut;
}

function getLUTs(pixelRepresentation, lutSequence) {
  if (!lutSequence || !lutSequence.items || !lutSequence.items.length) {
    return;
  }
  const luts = [];

  for (let i = 0; i < lutSequence.items.length; i++) {
    const lutDataSet = lutSequence.items[i].dataSet;
    const lut = getLUT(pixelRepresentation, lutDataSet);

    if (lut) {
      luts.push(lut);
    }
  }

  return luts;
}

export default getLUTs;
