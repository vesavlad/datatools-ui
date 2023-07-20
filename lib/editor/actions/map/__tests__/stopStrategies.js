import clone from 'lodash/cloneDeep'

import { updateShapeDistTraveled } from '../stopStrategies'

const loopControlPoints = require('./fixtures/loop-ctrl-points.json')
const loopPatternSegments = require('./fixtures/loop-pattern-segments.json')
const loopPatternStops = require('./fixtures/loop-pattern-stops.json')

describe('editor > actions > stopStrategies', () => {
  describe('updateShapeDistTraveled', () => {
    it('should populate distance traveled', () => {
      const clonedPatternStops = clone(loopPatternStops)
      updateShapeDistTraveled(loopControlPoints, loopPatternSegments, clonedPatternStops)

      expect(clonedPatternStops[0].shapeDistTraveled).toBe(0)

      // Traveled distance should be in ascending order.
      // If a pattern contains a loop, the total distance traveled from start
      // should be populated as opposed to the distance when hitting a repeated stop the first time.
    })
  })
})
