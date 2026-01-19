import UIAbility from '@ohos.app.ability.UIAbility';
import hilog from '@ohos.hilog';
import window from '@ohos.window';
import { RNAbility } from 'rnoh';

const TAG = 'EntryAbility';
const DOMAIN = 0x0000;

export default class EntryAbility extends RNAbility {
  onCreate(want, launchParam) {
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onCreate');
    super.onCreate(want, launchParam);
  }

  onDestroy() {
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onDestroy');
    super.onDestroy();
  }

  onWindowStageCreate(windowStage: window.WindowStage) {
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onWindowStageCreate');

    super.onWindowStageCreate(windowStage);

    windowStage.loadContent('pages/Index', (err, data) => {
      if (err.code) {
        hilog.error(DOMAIN, TAG, 'Failed to load the content. Cause: %{public}s', JSON.stringify(err) ?? '');
        return;
      }
      hilog.info(DOMAIN, TAG, 'Succeeded in loading the content. Data: %{public}s', JSON.stringify(data) ?? '');
    });
  }

  onWindowStageDestroy() {
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onWindowStageDestroy');
    super.onWindowStageDestroy();
  }

  onForeground() {
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onForeground');
    super.onForeground();
  }

  onBackground() {
    hilog.info(DOMAIN, TAG, '%{public}s', 'Ability onBackground');
    super.onBackground();
  }
}
