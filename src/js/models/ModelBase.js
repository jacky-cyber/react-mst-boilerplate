import { types } from 'mobx-state-tree';

export default types.compose(
  'ModelBase',
  types.model('ModelBase', {
    id: types.maybe(types.identifier(types.number)),
    created_at: types.maybe(types.Date),
    updated_at: types.maybe(types.Date),
  }),
);
