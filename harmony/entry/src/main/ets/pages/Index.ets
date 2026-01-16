import { RNApp } from 'rnoh'

@Entry
@Component
struct Index {
  @StorageLink('RNAbility') rnAbility: RNAbility

  aboutToAppear() {
    hilog.info(0x0000, 'Index', '%{public}s', 'aboutToAppear');
  }

  build() {
    Column() {
      RNApp({
        rnInstanceConfig: {
          createRNPackages,
          enableNDKTextMeasuring: true,
          enableBackgroundExecutor: false,
          enableCAPIArchitecture: true,
        },
        initialProps: {},
        appKey: 'LabX',
        wrappedCustomRNComponentBuilder: wrappedCustomRNComponentBuilder,
        onSetUp: (rnInstance) => {
          // 初始化回调
        },
        handle: this.rnAbility
      })
    }
    .width('100%')
    .height('100%')
  }
}

function createRNPackages(ctx: RNPackageContext) {
  return [
    new SamplePackage(ctx)
  ]
}

function wrappedCustomRNComponentBuilder(ctx: ComponentBuilderContext) {
  // 自定义组件构建器
}
