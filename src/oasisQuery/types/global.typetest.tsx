export function ExpectEnvToHaveStrictType() {
  import.meta.env.REACT_APP_SHOW_BUILD_BANNERS = 'false'
  import.meta.env.REACT_APP_SHOW_BUILD_BANNERS = 'true'
  import.meta.env.REACT_APP_API = 'https://'

  import.meta.env.REACT_APP_SHOW_BUILD_BANNERS = 'unsupported_value'
  import.meta.env.REACT_APP_API = undefined
}
