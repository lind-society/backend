// class used as an interface since interface and type are erased at runtime

export class PlaceNearby {
  name!: string;
  distance!: number;
}

export class Icon {
  url!: string;
  key!: string;
}
