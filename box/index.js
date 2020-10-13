/**
 * OrbitControls.js 负责控制操作    https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls
 */
class Applection{
    //  舞台
    scene  = THREE.Scene;
    //  相机
    camera = THREE.PerspectiveCamera;
    //  渲染
    renderer = THREE.WebGLRenderer;
    //  fps
    stats = Stats;
    constructor(){
        this.scene = new THREE.Scene();
        /**
         * 视野大小
         * 视图长宽比例
         * 近景
         * 原景
         */
        this.camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
        //  清除锯齿 antialias
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setSize(window.innerWidth,window.innerHeight)
        document.body.appendChild(this.renderer.domElement);
        //  根据窗口大小调整画布
        window.addEventListener('resize',()=>this.onWindowResize())
        /**
         * 加载图片材质
         * 先加载图片 
         * 通过MeshBasicMaterial 的map属性添加
         */
        const textureLoader = new THREE.TextureLoader()
        const boxTextureLoader = textureLoader.load('./xz.jpeg')

        /**
         * 几何图形
         * 长方体图形
         * 长 宽 高
         */
        const boxGeometry = new THREE.BoxGeometry(1,1,1)
        /**
         * map 渲染材质
         * side 双面渲染 可以渲染内部
         */
        const meshBasicMaterial = new THREE.MeshBasicMaterial({map:boxTextureLoader,side:THREE.DoubleSide})
        const mesh = new THREE.Mesh(boxGeometry,meshBasicMaterial);
        //  设置名字 通过 getObjectByName 获取
        mesh.name = 'box'

        //  渲背景  渲染顺序 右 左 上 下 后 前
        const skyboxMaterial = [
            new THREE.MeshBasicMaterial({map:textureLoader.load('./image/skybox/rt.png'),side:THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map:textureLoader.load('./image/skybox/lf.png'),side:THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map:textureLoader.load('./image/skybox/up.png'),side:THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map:textureLoader.load('./image/skybox/dn.png'),side:THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map:textureLoader.load('./image/skybox/bk.png'),side:THREE.DoubleSide}),
            new THREE.MeshBasicMaterial({map:textureLoader.load('./image/skybox/ft.png'),side:THREE.DoubleSide})
        ]
        const skyboxGeometry = new THREE.BoxGeometry(200,200,200);
        const skyboxMesh = new THREE.Mesh(skyboxGeometry,skyboxMaterial)
        skyboxMesh.name = 'skyboxMesh'
        // 添加到视图
        this.scene.add(mesh)
        this.scene.add(skyboxMesh)
        /**
         * 设置相机位置
         * x y z(z越小位置越近)
         */
        this.camera.position.set(0,0,5)
        
        //  设置 fps值
        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)

        //  控制相关    
        //  引入就能操作了～～～
        new THREE.OrbitControls(this.camera,this.renderer.domElement)
        this.render()
    }
    onWindowResize(){
        console.log(this.camera);
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        //  处理 浏览器缩放
        this.camera.aspect = window.innerWidth/window.innerHeight
        //  更新窗口
        this.camera.updateProjectionMatrix()
    }
    render(){
        //  fps 开始 最面结束 可以获取渲染值
        this.stats.begin()
        requestAnimationFrame(()=> this.render())
        this.renderer.render(this.scene,this.camera)
        //  箱子转动
        const box = this.scene.getObjectByName('box');
        box.rotation.x += 0.01
        box.rotation.y += 0.01
        //  天空转动
        const skyboxMesh = this.scene.getObjectByName('skyboxMesh');
        skyboxMesh.rotation.y += 0.001
        this.stats.end()
    }
}

new Applection() 