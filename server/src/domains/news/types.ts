export interface INew {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly text: string;
  readonly creatorId: string;
}

export interface INewRenderData extends Omit<INew, 'creatorId'> {
  readonly creatorUsername: string;
}
