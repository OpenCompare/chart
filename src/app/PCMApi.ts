declare var Kotlin: any;

import 'rxjs/Rx'
import {Observable} from 'rxjs/Rx';

export class PCMApi {

  loader: any;
  serializer: any;

  constructor() {
    let pcmMM = Kotlin.modules['org.opencompare.model.pcm'].org.opencompare.model.pcm;
    let factory = new pcmMM.factory.DefaultPcmFactory();
    this.loader = factory.createJSONLoader();
    this.serializer = factory.createJSONSerializer();
  }


  loadPCMModelFromString(json) {
    return this.loader.loadModelFromString(json).get(0);
  };

  serializePCM (pcm) {
    return this.serializer.serialize(pcm);
  };

  encodePCM(pcm) {
    this.base64PCMVisitor(pcm, true);
    return pcm;
  }

  decodePCM(pcm) {
    this.base64PCMVisitor(pcm, false);
    return pcm;
  }

  base64PCMVisitor (pcm, encoding) {
    function encodeToBase64(str, encoding) {
      if (encoding) {
        return btoa(str);
      } else {
        return atob(str);
      }
    }

    function base64FeatureVisitor(feature, encoding) {
      feature.name = encodeToBase64(feature.name, encoding);

      if (typeof feature.subFeatures !== 'undefined') {
        feature.subFeatures.array.forEach(function (subFeature) {
          base64FeatureVisitor(subFeature, encoding);
        });
      }
    }

    pcm.name = encodeToBase64(pcm.name, encoding);
    pcm.features.array.forEach(function (feature) {
      base64FeatureVisitor(feature, encoding);
    });

    pcm.products.array.forEach(function (product) {
      product.cells.array.forEach(function (cell) {
        cell.content = encodeToBase64(cell.content, encoding);
        cell.rawContent = encodeToBase64(cell.rawContent, encoding);

        // TODO : recursive encoding/decoding of interpretation
        if (typeof cell.interpretation !== "undefined" &&
          cell.interpretation !== null &&
          cell.interpretation.metaClassName() === "org.opencompare.model.StringValue") {
          cell.interpretation.value = encodeToBase64(cell.interpretation.value, encoding)
        }

      });
    });
  };

  findCell(product, feature) {
    var cells = product.cells.array;
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      if (cell.feature.name === feature.name) {
        return cell;
      }
    }
  };

  getConcreteFeatures(pcm) {

    function getConcreteFeaturesRec(aFeature) {
      var features = [];

      if (typeof aFeature.subFeatures !== 'undefined') {
        var subFeatures = aFeature.subFeatures.array;
        for (var i = 0; i < subFeatures.length; i++) {
          var subFeature = subFeatures[i];
          features = features.concat(getConcreteFeaturesRec(subFeature));
        }
      } else {
        features.push(aFeature);
      }

      return features;
    }

    var features = [];

    if (typeof pcm.features !== 'undefined') {
      var aFeatures = pcm.features.array;

      for (var i = 0; i < aFeatures.length; i++) {
        var aFeature = aFeatures[i];
        features = features.concat(getConcreteFeaturesRec(aFeature))
      }
    }

    return features;
  };

  getSortedProducts(pcm, metadata) {

    function getPosition(product) {
      var position = 0;
      for (var i = 0; i < metadata.productPositions.length; i++) {

        var productName = this.findCell(product, pcm.productsKey).content;

        if (metadata.productPositions[i].product === productName) {
          position = metadata.productPositions[i].position;
          break;
        }
      }

      return position;
    }

    if (metadata) {
      return pcm.products.array.sort(function (p1, p2) {

        var p1Position = getPosition(p1);
        var p2Position = getPosition(p2);

        return p1Position - p2Position;
      });
    } else {
      return pcm.products.array;
    }

  }

  getProductsKey(product, key) {
    return this.findCell(product, key).content;
  }

  getMainTypeOfFeature(feature) : string {

    let types = {};
    feature.cells.array.forEach((cell) => {
        if (typeof cell.interpretation !== "undefined" && cell.interpretation !== null) {
          let type = cell.interpretation.metaClassName();
          if (typeof types[type] === "undefined") {
            types[type] = 0;
          } else {
            types[type] = types[type] + 1;
          }

        }
      });

    // console.log(feature.name);
    // console.log(types);

    let mainType = {name: "none", count: 0};
    for (let type in types) {
      let count = types[type];
      if (count > mainType.count) {
        mainType = {name: type, count: count}
      }
    }

    return mainType.name;
  }

  isNumericalInterpretation(interpretation) : boolean {
    let type = interpretation.metaClassName();
    return type === "org.opencompare.model.IntegerValue" || type === "org.opencompare.model.RealValue";
  }


}
