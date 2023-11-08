// @flow
// $FlowFixMe: Flow doesn't know about useState: https://stackoverflow.com/questions/53105954/cannot-import-usestate-because-there-is-no-usestate-export-in-react-flow-with
import React, {useCallback, useState} from 'react'
import {Button, Checkbox, FormControl, Modal} from 'react-bootstrap'

import * as tripActions from '../../actions/trip'
import {getComponentMessages} from '../../../common/util/config'
import HourMinuteInput from '../HourMinuteInput'
import type {Trip} from '../../../types'

type Props = {
  addNewTrip: typeof tripActions.addNewTrip,
  constructNewRow: (trip: ?Trip, tripSeriesStartTime: ?number, autoTripId: ?string, autoBlockId: ?string) => ?Trip,
  onClose: () => void,
  show: boolean,
  useSecondsInOffset: boolean
}

const TripSeriesModal = (props: Props) => {
  // Trip series timing state variables
  const [startTime, setStartTime] = useState(null)
  const [headway, setHeadway] = useState(null)
  const [endTime, setEndTime] = useState(null)

  // Automatic block and trip ID state variables
  const [useAutoTripIds, setUseAutoTripIds] = useState(false)
  const [useAutoBlockIds, setUseAutoBlockIds] = useState(false)

  const [autoTripIdStart, setAutoTripIdStart] = useState(0)
  const [autoBlockIdStart, setAutoBlockIdStart] = useState(1)

  const [autoTripIdIncrement, setAutoTripIdIncrement] = useState(1)
  const [autoBlockIdIncrement, setAutoBlockIdIncrement] = useState(1)

  const [autoTripIdPrefix, setAutoTripIdPrefix] = useState('')
  const [autoBlockIdPrefix, setAutoBlockIdPrefix] = useState('')

  const messages = getComponentMessages('TripSeriesModal')

  const handleIncrementStartUpdate = (evt: SyntheticInputEvent<HTMLInputElement>) => setAutoTripIdStart(+evt.target.value)
  const handleBlockIdStartUpdate = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    // Check the input to make sure it's within the valid range.
    let input = +evt.target.value
    if (isNaN(input)) return null
    if (input > autoBlockIdIncrement) input = autoBlockIdIncrement
    else if (input < 1) input = 1
    setAutoBlockIdStart(input)
  }

  const handleTripPrefixUpdate = (evt: SyntheticInputEvent<HTMLInputElement>) => setAutoTripIdPrefix(evt.target.value)
  const handleBlockPrefixUpdate = (evt: SyntheticInputEvent<HTMLInputElement>) => setAutoBlockIdPrefix(evt.target.value)

  const handleTripIncrementUpdate = (evt: SyntheticInputEvent<HTMLInputElement>) => setAutoTripIdIncrement(+evt.target.value)
  const handleBlockIncrementUpdate = (evt: SyntheticInputEvent<HTMLInputElement>) => setAutoBlockIdIncrement(+evt.target.value)

  const handleAutoTripIDCheckBox = () => setUseAutoTripIds(!useAutoTripIds)
  const handleAutoBlockIDCheckBox = () => setUseAutoBlockIds(!useAutoBlockIds)

  const clearState = () => {
    setStartTime(null)
    setEndTime(null)
    setHeadway(null)
    setAutoTripIdPrefix('')
    setAutoTripIdStart(0)
    setAutoTripIdIncrement(1)
    setAutoBlockIdStart(1)
    setAutoBlockIdIncrement(1)
    setAutoBlockIdPrefix('')
    setUseAutoBlockIds(false)
    setUseAutoTripIds(false)
  }

  const _onClose = () => {
    const { onClose } = props
    clearState()
    onClose()
  }

  const onClickGenerate = useCallback(() => {
    const {addNewTrip, constructNewRow, onClose} = props
    // Check state variables to make flow happy
    if (startTime === null || endTime === null || headway === null) return
    const adjustedEndTime = startTime < endTime ? endTime : endTime + 24 * 60 * 60

    let tripId = autoTripIdStart
    let currentBlockIdSuffix = autoBlockIdStart
    for (let time = startTime; time <= adjustedEndTime; time += headway) {
      const autoTripId = useAutoTripIds ? `${autoTripIdPrefix}-${tripId}` : null
      const autoBlockId = useAutoBlockIds ? `${autoBlockIdPrefix}-${currentBlockIdSuffix}` : null
      addNewTrip(constructNewRow(null, time, autoTripId, autoBlockId))
      // If we're upating the trip IDs automatically, increment the trip ID:
      if (useAutoTripIds) tripId += autoTripIdIncrement
      // If we're updating the Block IDs automatically, alternate according to input number
      if (useAutoBlockIds) {
        currentBlockIdSuffix += 1
        // If we increase past the alternating number, use the modulus to reset
        if (currentBlockIdSuffix > autoBlockIdIncrement) currentBlockIdSuffix = currentBlockIdSuffix % autoBlockIdIncrement
      }
    }
    clearState()
    onClose()
  }, [endTime, startTime, headway, autoTripIdStart, autoTripIdIncrement, autoTripIdPrefix, autoBlockIdPrefix, autoBlockIdIncrement, autoBlockIdStart])

  const {Body, Footer, Header, Title} = Modal
  const {onClose, show, useSecondsInOffset} = props
  const generateTripsDisabled = startTime === null || endTime === null || !headway
  return (
    <Modal show={show} onHide={onClose}>
      <Header><Title>{messages('createTripSeriesQuestion')}</Title></Header>
      <Body>
        <p>{messages('createTripSeriesBody')}</p>
        <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
          <div>
            {messages('startTime')
            }<HourMinuteInput onChange={setStartTime} seconds={startTime} showSeconds={useSecondsInOffset} standaloneInput />
          </div>
          <div style={{marginLeft: '20px'}}>
            {messages('headway')}
            <HourMinuteInput onChange={setHeadway} seconds={headway} showSeconds={useSecondsInOffset} standaloneInput />
          </div>
          <div style={{margin: '0px 0px 0px 20px'}}>
            {messages('endTime')}
            <HourMinuteInput onChange={setEndTime} seconds={endTime} showSeconds={useSecondsInOffset} standaloneInput />
          </div>
        </div>
        <hr />
        <div>
          <Checkbox checked={useAutoTripIds} onChange={handleAutoTripIDCheckBox}>{messages('automaticallyUpdateTripIds')}</Checkbox>
          {useAutoTripIds &&
            <>
              <div style={{alignItems: 'center', display: 'flex'}}>
                <>
                  <FormControl
                    onChange={handleTripPrefixUpdate}
                    placeholder={messages('prefixPlaceholder')}
                    style={{width: '30%', marginRight: '5px'}}
                    type='text'
                    value={autoTripIdPrefix}
                  />
                -
                  <FormControl
                    onChange={handleIncrementStartUpdate}
                    placeholder={messages('incrementStartPlaceholder')}
                    style={{width: '40%', marginLeft: '5px', marginRight: '5px'}}
                    type='number'
                  />
                  {messages('incrementBy')}
                  <FormControl
                    onChange={handleTripIncrementUpdate}
                    placeholder={messages('incrementAmountPlaceholder')}
                    style={{width: '15%', marginLeft: '5px'}}
                    type='number'
                    value={autoTripIdIncrement}
                  />
                </>
              </div>
              <hr />
            </>
          }
        </div>
        <div>
          <Checkbox checked={useAutoBlockIds} onChange={handleAutoBlockIDCheckBox}>{messages('automaticallyUpdateBlockIds')} </Checkbox>
          {useAutoBlockIds &&
            <>
              <div style={{alignItems: 'center', display: 'flex'}}>
                <FormControl
                  onChange={handleBlockPrefixUpdate}
                  placeholder={messages('blockIdPrefixPlaceholder')}
                  style={{width: '20%', marginRight: '5px'}}
                  type='text'
                  value={autoBlockIdPrefix}
                />
                {messages('alternateEvery')}
                <FormControl
                  onChange={handleBlockIncrementUpdate}
                  placeholder={messages('blockIncrementPlaceholder')}
                  style={{width: '15%', marginLeft: '5px', marginRight: '5px'}}
                  type='number'
                  value={autoBlockIdIncrement}
                />
                {messages('tripsStartingWith')}
                <FormControl
                  max={autoBlockIdIncrement}
                  min={1}
                  onChange={handleBlockIdStartUpdate}
                  style={{width: '15%', marginLeft: '5px', marginRight: '5px'}}
                  type='number'
                  value={autoBlockIdStart}
                />
              </div>
              <span style={{fontSize: 'smaller'}}>{messages('formatExplanation')}</span>
            </>
          }
        </div>

      </Body>
      <Footer>
        <Button
          bsStyle='primary'
          disabled={generateTripsDisabled}
          onClick={onClickGenerate}
          title={generateTripsDisabled && messages('disabledTooltip')}
        >
          {messages('generateTrips')}
        </Button>
        <Button
          onClick={_onClose}>
          {messages('close')}
        </Button>
      </Footer>
    </Modal>
  )
}

export default TripSeriesModal
