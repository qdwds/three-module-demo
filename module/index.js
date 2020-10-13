
/**
 * OrbitControls.js 负责控制操作    https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
 */

// console.log(THREE);
class Applection {
    //  舞台
    scene = THREE.Scene;
    //  相机
    camera = THREE.PerspectiveCamera;
    //  渲染
    renderer = THREE.WebGLRenderer;
    //  fps
    stats = Stats;
    //  模型loader
    gltfLoader = THREE.GLTFLoader
    animationMixer = THREE.AnimationMixer;
    //  始终
    clock = THREE.Clock;
    gltf = null;
    // 全局 动画
    action = THREE.AnimationAction
    constructor() {
        this.scene = new THREE.Scene();
        /**
         * 视野大小
         * 视图长宽比例
         * 近景
         * 原景
         */
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        //  清除锯齿 antialias
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement);
        //  实例话 模型loader
        this.gltfLoader = new THREE.GLTFLoader();
        //  需要传入 root 也就是当前的舞台
        this.animationMixer = new THREE.AnimationMixer(this.scene)
        //  实例话时钟
        this.clock = new THREE.Clock()
        //  根据窗口大小调整画布
        window.addEventListener('resize', () => this.onWindowResize())
        this.camera.position.set(0, 5, 5)

        //  添加平面
        const planeBufferGeometry = new THREE.PlaneBufferGeometry(100, 100)
        const plane = new THREE.Mesh(planeBufferGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }))
        //  给地板起名 用于 点击事件 过滤地板
        plane.name = 'plane'
        this.scene.add(plane)
        //  添加网格
        this.scene.add(new THREE.GridHelper(100, 100))
        plane.rotation.x = -Math.PI / 2
        //  设置 fps值
        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)

        //  实例化后 加载loader 
        this.gltfLoader.load('./Soldier.glb', (gltf) => {
            console.log(gltf);
            //  添加模型到舞台当中
            this.scene.add(gltf.scene)
            this.gltf = gltf
            gltf.scene.name = 'soldier'
            //  添加背景光
            this.scene.add(new THREE.AmbientLight(0xffffff, 1))
            //  获取动画
            const animtaionClip = gltf.animations.find(animtaionClip => animtaionClip.name == 'Walk');
            console.log(animtaionClip);
            this.action = this.animationMixer.clipAction(animtaionClip);
            this.action.play()
        })
        //  获取鼠标点击事件
        this.renderer.domElement.addEventListener('click', (event) => {
            const { offsetX, offsetY } = event;
            // https://threejs.org/docs/index.html#api/en/core/Raycaster
            const x = (offsetX / window.innerWidth) * 2 - 1;
            const y = - (offsetY / window.innerHeight) * 2 + 1;
            //  创建鼠标点击的坐标
            const mousePoint = new THREE.Vector2(x, y);

            const raycaster = new THREE.Raycaster()
            //  设置在那个相机
            raycaster.setFromCamera(mousePoint, this.camera)
            //  检测那些物体被点击 
            //  设置true 是让递归是判断， 否则 无法检测到 模型
            let interects = raycaster.intersectObjects(this.scene.children, true)
            //  过滤网格 和 舞台 只取 最外层被点击的数据
            let interect = interects.filter(interect =>
                !(interect.object instanceof THREE.GridHelper)
                && interect.object.name !== 'plane')[0]

            if(interect && this.isClickSoldier(interect.object)){
                console.log(interect);
                //  点击停止
                this.action.stop()
                this.Idle()
            }
           
        })

        this.renderer.domElement.addEventListener('keyup', (event) => {
            console.log(event.keyCode);
            const { offsetX, offsetY } = event;
            // https://threejs.org/docs/index.html#api/en/core/Raycaster
            const x = (offsetX / window.innerWidth) * 2 - 1;
            const y = - (offsetY / window.innerHeight) * 2 + 1;
            //  创建鼠标点击的坐标
            const mousePoint = new THREE.Vector2(x, y);

            const raycaster = new THREE.Raycaster()
            //  设置在那个相机
            raycaster.setFromCamera(mousePoint, this.camera)
            //  检测那些物体被点击 
            //  设置true 是让递归是判断， 否则 无法检测到 模型
            let interects = raycaster.intersectObjects(this.scene.children, true)
            //  过滤网格 和 舞台 只取 最外层被点击的数据
            let interect = interects.filter(interect =>
                !(interect.object instanceof THREE.GridHelper)
                && interect.object.name !== 'plane')[0]

            if(interect && this.isClickSoldier(interect.object)){
                console.log(interect);
                //  点击停止
                this.action.stop()
                this.Idle()
            }
           let code = event.keyCode
            if(code === 38){
                this.Idle()
            }else if (code === 37){
                this.Run()
            }else if (code === 39){
                this.TPose()
            }
        })

        //  控制相关    
        //  引入就能操作了～～～
        new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.render()
    }
    onWindowResize() {
        console.log(this.camera);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        //  处理 浏览器缩放
        this.camera.aspect = window.innerWidth / window.innerHeight
        //  更新窗口
        this.camera.updateProjectionMatrix()
    }
    //  递归判断点击的是否是模型最外面一层
    isClickSoldier(object) {
        //  如果是最外层 直接返回
        if (object.name === 'soldier') {
            return object
        //  如果不是最外层 递归执行
        } else if (object.parent) {
            return this.isClickSoldier(object.parent)
        } else {
            return null;
        }
    }
    render() {
        //  fps 开始 最面结束 可以获取渲染值
        this.stats.begin()
        this.animationMixer.update(this.clock.getDelta())
        requestAnimationFrame(() => this.render())
        this.renderer.render(this.scene, this.camera)

        this.stats.end()
    }
    Idle(){
        const animtaionClip = this.gltf.animations.find(animtaionClip => animtaionClip.name == 'Idle');
        this.action = this.animationMixer.clipAction(animtaionClip);
        this.action.play()
    }
    Run(){
        const animtaionClip = this.gltf.animations.find(animtaionClip => animtaionClip.name == 'Run');
        this.action = this.animationMixer.clipAction(animtaionClip);
        this.action.play()
    }
    TPose(){
        const animtaionClip = this.gltf.animations.find(animtaionClip => animtaionClip.name == 'TPose');
        this.action = this.animationMixer.clipAction(animtaionClip);
        this.action.play()
    }
    Walk(){
        const animtaionClip = this.gltf.animations.find(animtaionClip => animtaionClip.name == 'Walk');
        this.action = this.animationMixer.clipAction(animtaionClip);
        this.action.play()
    }
}

new Applection() 